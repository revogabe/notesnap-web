import { cn } from "@/lib/utils"

export function TypographyH1(props: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h1
      {...props}
      className={cn(
        "scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance font-sans",
        props.className
      )}
    >
      {props.children}
    </h1>
  )
}

export function TypographyH2(props: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      className={cn(
        "scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0 font-sans",
        props.className
      )}
    >
      {props.children}
    </h2>
  )
}

export function TypographyH3(props: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h3
      {...props}
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight font-sans",
        props.className
      )}
    >
      {props.children}
    </h3>
  )
}

export function TypographyH4(props: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h4
      {...props}
      className={cn("text-lg font-bold font-sans", props.className)}
    >
      {props.children}
    </h4>
  )
}

export function TypographyP(props: React.HTMLProps<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      className={cn("text-sm text-muted-foreground font-sans", props.className)}
    >
      {props.children}
    </p>
  )
}

export function TypographyBlockquote(props: React.HTMLProps<HTMLQuoteElement>) {
  return (
    <blockquote
      {...props}
      className={cn("mt-6 border-l-2 pl-6 italic font-sans", props.className)}
    >
      {props.children}
    </blockquote>
  )
}

export function TypographyMuted(props: React.HTMLProps<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      className={cn("text-muted-foreground text-sm", props.className)}
    >
      {props.children}
    </p>
  )
}
