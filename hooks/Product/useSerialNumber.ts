import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getSerialNumbers,
	getSerialNumberById,
	createSerialNumber,
	updateSerialNumber,
	deleteSerialNumber,
} from "@/shared/api/product/serialNumberApi";
import {
	CreateSerialNumberRequest,
	UpdateSerialNumberRequest,
	SerialNumberQuery,
} from "@/types/product/serialNumber";

export const SERIAL_KEYS = {
	all: ["serial-numbers"] as const,
	list: (params?: object) => [...SERIAL_KEYS.all, "list", params] as const,
	detail: (id: string) => [...SERIAL_KEYS.all, "detail", id] as const,
};

export const useGetSerialNumbers = (params: SerialNumberQuery) =>
	useQuery({
		queryKey: SERIAL_KEYS.list(params),
		queryFn: () => getSerialNumbers(params),
		staleTime: 5 * 60 * 1000,
	});

export const useGetSerialNumberById = (id: string) =>
	useQuery({
		queryKey: SERIAL_KEYS.detail(id),
		queryFn: () => getSerialNumberById(id),
		enabled: !!id,
	});

export const useCreateSerialNumber = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: CreateSerialNumberRequest) =>
			createSerialNumber(body),
		onSuccess: () => qc.invalidateQueries({ queryKey: SERIAL_KEYS.all }),
	});
};

export const useUpdateSerialNumber = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: UpdateSerialNumberRequest) =>
			updateSerialNumber(body),
		onSuccess: (_data, vars) => {
			qc.invalidateQueries({ queryKey: SERIAL_KEYS.all });
			qc.invalidateQueries({ queryKey: SERIAL_KEYS.detail(vars.id) });
		},
	});
};

export const useDeleteSerialNumber = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteSerialNumber(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: SERIAL_KEYS.all }),
	});
};
