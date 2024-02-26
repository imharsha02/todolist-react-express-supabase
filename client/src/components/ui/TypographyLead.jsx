export function TypographyLead({children, className}) {
    return (
      <p className={`text-xl text-muted-foreground ${className}`}>
        {children}
      </p>
    )
  }