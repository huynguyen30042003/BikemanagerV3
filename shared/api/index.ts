import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const APP_URL = "https://localhost:5001";

interface FailedQueueItem {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class Api {
  public instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: FailedQueueItem[] = [];

  constructor() {
    this.instance = axios.create({
      baseURL: APP_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private isExpiredTokenError(error: AxiosError | any): boolean {
    return error.response?.status === 401;
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (token) {
        resolve(token);
      } else {
        reject(error);
      }
    });
    this.failedQueue = [];
  }

  private async refreshToken(): Promise<string> {
    try {
      const response = await axios.post(
        "/api/auth/refresh",
        {},
        {
          withCredentials: true,
        },
      );

      const newAccessToken = response.data.access_token;
      localStorage.setItem("access_token", newAccessToken);
      localStorage.setItem(
        "expires_at",
        (Math.floor(Date.now() / 1000) + response.data.expires_in).toString(),
      );
      return newAccessToken;
    } catch (error) {
      console.error("[REFRESH TOKEN] Failed", error);
      window.location.href = "/login";
      throw error;
    }
  }

  // =========================
  // SETUP INTERCEPTORS
  // =========================
  private setupInterceptors() {
    // REQUEST
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        config.withCredentials = true;

        const expiresAt = Number(localStorage.getItem("expires_at"));
        // token hết hạn
        if (expiresAt && Date.now() >= expiresAt * 1000) {
          try {
            await this.refreshToken();
          } catch (error) {
            console.error("[AUTO REFRESH FAILED]", error);
          }
        }

        return config;
      },
    );

    // RESPONSE
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        console.error("[RESPONSE ERROR]", {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        const originalRequest = error.config as CustomAxiosRequestConfig;

        // chỉ cần 401 là refresh
        if (!this.isExpiredTokenError(error)) {
          return Promise.reject(error);
        }

        if (originalRequest?._retry) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (this.isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
              }
              return this.instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        this.isRefreshing = true;

        try {
          const newToken = await this.refreshToken();

          this.instance.defaults.headers.common["Authorization"] =
            `Bearer ${newToken}`;
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          }

          this.processQueue(null, newToken);

          return this.instance(originalRequest);
        } catch (refreshError) {
          this.processQueue(refreshError, null);

          if (typeof window !== "undefined") {
            // window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        } finally {
          this.isRefreshing = false;
        }
      },
    );
  }
}

const api = new Api().instance;
export default api;
