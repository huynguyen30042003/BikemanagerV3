"use client";
import { useLogout, useMe } from "@/hooks/Auth/useAuth";
import Link from "next/link";

import { useRouter } from "next/navigation";

import { useState } from "react";

const Navbar = () => {
  const [isOpenAdmin, setIsOpenAdmin] = useState(false);

  const router = useRouter();

  const { data, isLoading } = useMe();

  const logout = useLogout();

  return (
    <div className="sticky top-0 w-full bg-gray-100 border border-b-2">
      <div className="container px-5 mx-auto flex justify-between items-center">
        <div>
          <p className="text-[32px]">News</p>
        </div>

        <div className="flex gap-10">
          <ul className="flex gap-2 items-center">
            <li>
              <Link className="text-[20px]" href="/news">
                News
              </Link>
            </li>

            <li>
              <Link className="text-[20px]" href="/news">
                About
              </Link>
            </li>

            <li>
              <Link className="text-[20px]" href="/news">
                Contact
              </Link>
            </li>
          </ul>

          <div className="relative flex items-center">
            {data ? (
              <div
                className="cursor-pointer flex items-center"
                onClick={() => setIsOpenAdmin((prev) => !prev)}
              >
                <div className="flex items-center gap-1 text-[20px]">
                  {!isLoading && <h2>{data?.name || data?.sub}</h2>}
                </div>

                {isOpenAdmin && (
                  <div className="absolute top-full right-0 mt-2 w-30 px-5 py-2 bg-white border rounded-lg shadow-lg z-50">
                    <p className="cursor-pointer" onClick={logout}>
                      Logout
                    </p>

                    <p
                      className="cursor-pointer"
                      onClick={() => alert("wait for update")}
                    >
                      Setting
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => router.push("/login")}>Login</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
