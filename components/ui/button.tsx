import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { tv, type VariantProps } from "tailwind-variants"

const buttonVariants = tv({
  base: "button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  variants: {
    variant: {
      default: "button--default bg-primary text-primary-foreground hover:bg-primary/90",
      outline:
        "button--outline border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
      secondary:
        "button--secondary bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
      ghost:
        "button--ghost hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
      destructive:
        "button--destructive bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
      link: "button--link text-primary underline-offset-4 hover:underline",
    },
    size: {
      default:
        "button--default-size h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      xs: "button--xs h-6 gap-1 px-2 text-xs in-data-[slot=button-group]:rounded-none [&_svg:not([class*='size-'])]:size-3",
      sm: "button--sm h-7 gap-1 px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-none [&_svg:not([class*='size-'])]:size-3.5",
      lg: "button--lg h-10 gap-1.5 px-4 text-base has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      icon: "button--icon size-8",
      "icon-xs": "button--icon-xs size-6 in-data-[slot=button-group]:rounded-none [&_svg:not([class*='size-'])]:size-3",
      "icon-sm": "button--icon-sm size-7 in-data-[slot=button-group]:rounded-none",
      "icon-lg": "button--icon-lg size-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={buttonVariants({ variant, size, class: className })}
      {...props}
    />
  )
}

export { Button, buttonVariants }
