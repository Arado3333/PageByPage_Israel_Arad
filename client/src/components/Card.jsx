export const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className || ""}`} {...props}>
      {children}
    </div>
  )
}

export const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className || ""}`} {...props}>
      {children}
    </h3>
  )
}

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={`px-6 py-4 ${className || ""}`} {...props}>
      {children}
    </div>
  )
}

export const CardFooter = ({ className, children, ...props }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className || ""}`} {...props}>
      {children}
    </div>
  )
}
