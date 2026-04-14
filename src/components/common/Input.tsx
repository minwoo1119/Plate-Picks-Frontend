import styles from "./input.module.scss";

type InputProps = {
	label: string;
	placeholder: string;
	type?: "text" | "number";
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value?: string | number;
};

function Input({ placeholder, onChange, label, type, value }: InputProps) {
	return (
		<div className={styles.container}>
			<label className={styles.labelText}>{label}</label>
			<input
				type={type || "number"}
				placeholder={placeholder}
				onChange={onChange}
				value={value}
				className={styles.inputForm}
			/>
		</div>
	);
}

export default Input;
