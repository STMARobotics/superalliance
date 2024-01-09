"use client";

import { getFormById } from "@/lib/superallianceapi";
import { Affix, Button, Transition } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import FormView from "@/components/form-view";

function Form({ params }: { params: any }) {
  const [scroll, scrollTo] = useWindowScroll();
  const [formData, setFormData] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    (async function () {
      await getFormById(params.formId)
        .then((res) => {
          setFormData(res);
        })
        .catch((err) => null);
    })();
  });
  return (
    <div className="pt-3 flex flex-col w-full justify-center items-center">
      <>
        <Affix position={{ bottom: 20, right: 20 }}>
          <Transition transition="slide-up" mounted={scroll.y > 0}>
            {(transitionStyles) => (
              <Button
                size="sm"
                style={transitionStyles}
                onClick={() => scrollTo({ y: 0 })}
              >
                <IconArrowUp size={15} />
              </Button>
            )}
          </Transition>
        </Affix>
      </>

      {formData && (
        <div className="w-full max-w-md p-10">
          <FormView formData={formData} />
        </div>
      )}
      {!formData && <h1>nah not found man</h1>}
    </div>
  );
}

export default Form;
