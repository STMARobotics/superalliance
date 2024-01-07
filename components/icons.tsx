import Image from "next/image";

export const Icons = {
  logo: (props: any) => {
    return (
      <Image
        src="/images/superalliancelogo.png"
        alt="Super Alliance"
        width={50}
        height={50}
        {...props}
      />
    );
  },
  long: (props: any) => {
    return (
      <Image
        src="/images/superalliancewide.png"
        alt="Super Alliance"
        width={50}
        height={50}
        {...props}
      />
    );
  },
};
