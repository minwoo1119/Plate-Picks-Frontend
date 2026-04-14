import styles from "./button.module.scss";

type ButtonProps = {
	text: string;
	color?: string;
	fontColor?: string;
	onClick: () => void;
	disabled?: boolean;
	variant?: "primary" | "secondary" | "ghost";
};

function Button({
	text,
	color,
	fontColor,
	onClick,
	disabled,
	variant = "secondary",
}: ButtonProps) {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			className={`${styles.button} ${styles[variant]}`}
			style={
				{
					"--button-color": color,
					"--font-color": fontColor,
				} as React.CSSProperties
			}
		>
			{text}
		</button>
	);
}

export default Button;
