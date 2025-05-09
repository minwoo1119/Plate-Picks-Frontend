import styles from "./button.module.scss";

type ButtonProps = {
	text: string;
	color?: string;
	fontColor?: string;
	onClick: () => void;
	disabled?: boolean;
};

function Button({ text, color, fontColor, onClick, disabled }: ButtonProps) {
	return (
		<div className={styles.container}>
			<button
				disabled={disabled}
				onClick={onClick}
				style={
					{
						"--button-color": disabled ? "#EDF2F7" : color,
						"--font-color": disabled ? "#A0AEC0" : fontColor,
					} as React.CSSProperties
				}
			>
				{text}
			</button>
		</div>
	);
}

export default Button;
