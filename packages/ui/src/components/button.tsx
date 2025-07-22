export interface BtnProps {
  primary?: boolean
  size?: 'small' | 'large'
  label?: string
  /**
   * What background color to use
   */
  backgroundColor?: string
}

const Button = ({
  primary = false,
  label = 'Boop',
  size = 'small',
}: BtnProps) => {
  return (
    <button
      style={{
        backgroundColor: primary ? 'red' : 'blue',
        fontSize: size === 'large' ? '24px' : '14px',
      }}
    >
      {label}
    </button>
  )
}
export default Button
