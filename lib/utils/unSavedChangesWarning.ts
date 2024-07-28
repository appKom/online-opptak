import { useEffect } from "react";
import { useRouter } from "next/router";

const useUnsavedChangesWarning = (unsavedChanges: any) => {
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
      if (unsavedChanges) {
        const message =
          "Du har endringer som ikke er lagret, er du sikker på at du vil forlate siden?";
        e.returnValue = message;
        return message;
      }
    };

    const handleRouteChange = (url: any) => {
      if (
        unsavedChanges &&
        !window.confirm(
          "Du har endringer som ikke er lagret, er du sikker på at du vil forlate siden?"
        )
      ) {
        router.events.emit("routeChangeError");
        throw `Route change to "${url}" was aborted (this error can be safely ignored).`;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [unsavedChanges, router.events]);

  return null;
};

export default useUnsavedChangesWarning;
