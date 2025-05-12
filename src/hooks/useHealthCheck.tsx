import { getAxiosInstance } from "@/services/apiClient";
import { ServiceHealth } from "@/types";
import { useCallback, useMemo, useState } from "react";

const axiosInstance = getAxiosInstance();

export function useHealthCheck() {
  const [health, setHealth] = useState<ServiceHealth[]>([]);

  const checkHealth = useCallback(async () => {
    const {
      data: { servicesHealth },
    } = await axiosInstance.get<{
      servicesHealth: ServiceHealth[];
    }>("http-views-getServicesHealth");

    setHealth(servicesHealth);
  }, []);

  const isHealthy = useMemo(
    () => health.every(({ status }) => status === "UP"),
    [health]
  );

  const checkServiceHealth = useCallback(
    async (serviceName: keyof ServiceHealth) => {
      const {
        data: { servicesHealth },
      } = await axiosInstance.get<{
        servicesHealth: ServiceHealth[];
      }>("http-views-getServicesHealth");

      const serviceHealth = servicesHealth.find(
        ({ name }) => name === serviceName
      );
      return serviceHealth?.status === "UP";
    },
    []
  );

  return { health, isHealthy, checkHealth, checkServiceHealth };
}
