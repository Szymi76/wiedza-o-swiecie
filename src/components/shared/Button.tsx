import clsx from "clsx";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;
export default function Button(props: ButtonProps) {
  const { className, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      className={clsx(
        "bg-white px-3 lg:px-6 py-3 rounded-lg flex gap-3 items-center justify-center text-black font-bold w-full hover:scale-[.97] active:scale-[.94] focus:scale-[.94] duration-100 outline-none",
        className
      )}></button>
  );
}
