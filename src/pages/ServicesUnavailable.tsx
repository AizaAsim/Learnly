import { ErrorDisplay } from "@/components/ErrorDisplay";

function ServicesUnavailable() {
  return <ErrorDisplay type={"503"} />;
}

export default ServicesUnavailable;
