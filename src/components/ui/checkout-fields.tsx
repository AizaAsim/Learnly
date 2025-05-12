import { CardElement } from "@stripe/react-stripe-js";
import { Error } from "./error";
import { Input } from "./input";
import { useTranslation } from "react-i18next";

interface CheckoutFieldsProps {
  cardHolderName: string;
  setCardHolderName: (value: string) => void;
  error: string;
}

export const CheckoutFields = ({
  cardHolderName,
  setCardHolderName,
  error,
}: CheckoutFieldsProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1.5">
      <div>
        <Input
          placeholder={t("cardHolder_placeholder")}
          className="bg-grayscale-4 px-4 py-3.5 rounded-t-[14px] rounded-b-none border-x-0 border-t-0 border-b border-grayscale-4 text-grayscale-80 font-semibold placeholder:text-grayscale-50 md:placeholder:text-grayscale-40 md:placeholder:font-medium -tracking-[0.14px]"
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
        />
        <CardElement
          className="bg-grayscale-4 px-4 py-3.5 rounded-b-[14px]"
          options={{
            style: {
              base: {
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                letterSpacing: "-0.14px",
                color: "#000000cc",
                fontSize: "14px",
                lineHeight: "18px",
                "::placeholder": {
                  color: "#00000080",
                  fontWeight: 500,
                  letterSpacing: "-0.14px",
                  lineHeight: "18px",
                },
              },
            },
          }}
        />
      </div>
      {error && (
        <Error className="flex gap-1 items-center">
          <img src="/icon/info.svg" className="w-4 h-4" />
          {error}
        </Error>
      )}
    </div>
  );
};
