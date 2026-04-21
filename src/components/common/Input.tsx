import styles from "./input.module.scss";

type InputProps = {
	label: string;
	placeholder: string;
	type?: "text" | "number";
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value?: string | number;
	hint?: string;
};

function Input({
	placeholder,
	onChange,
	label,
	type,
	value,
	hint,
}: InputProps) {
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
			{hint && <div className={styles.hint}>{hint}</div>}
		</div>
	);
}

export default Input;
