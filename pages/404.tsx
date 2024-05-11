// pages/404.js
import Link from "next/link";
import Button from "../components/Button";
import Image from "next/image";

export default function Custom404() {
  return (
    <div className="flex flex-col text-center p-20">
      <h2 className="text-5xl font-bold text-center text-online-darkBlue">
        404
      </h2>

      <p className="py-10 text-lg">{"Denne siden finnes ikke"}</p>
      <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
        <Image
          src="/404.gif"
          alt="Not Found GIF"
          width={500}
          height={500}
          layout="responsive"
        />
      </div>

      <div>
        <Button
          title="Gå tilbake til hjem siden"
          color="blue"
          onClick={() => (window.location.href = "/")}
        />
      </div>
    </div>
  );
}
