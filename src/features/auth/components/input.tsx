export default function Input({
  icon: Icon,
  ...props
}: {
  icon?: React.ComponentType<{ className?: string }>;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      )}
      <input
        {...props}
        className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors ${props.className ?? ""}`}
      />
    </div>
  );
}
