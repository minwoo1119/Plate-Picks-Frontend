import styles from "./button.module.scss";

type ButtonProps = {
	text: string;
	color?: string;
	fontColor?: string;
	onClick: () => void;
};

function Button({ text, color, fontColor, onClick }: ButtonProps) {
	return (
		<div className={styles.container}>
			<button
				onClick={onClick}
				style={
					{
						"--button-color": color,
						"--font-color": fontColor,
					} as React.CSSProperties
				}
			>
				{text}
			</button>
		</div>
	);
}

export default Button;
