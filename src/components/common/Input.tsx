import styles from "./input.module.scss";

type InputProps = {
	label: string;
	placeholder: string;
	type?: "text" | "number";
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Input({ placeholder, onChange, label, type }: InputProps) {
	return (
		<div className={styles.container}>
			<div className={styles.labelText}>{label}</div>
			<input
				type={type || "number"}
				placeholder={placeholder}
				onChange={onChange}
				className={styles.inputForm}
			/>
		</div>
	);
}

export default Input;
