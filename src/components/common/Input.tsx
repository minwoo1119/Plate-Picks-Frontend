import styles from "./input.module.scss";

type InputProps = {
	label: string;
	placeholder: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Input({ placeholder, onChange, label }: InputProps) {
	return (
		<div className={styles.container}>
			<div className={styles.labelText}>{label}</div>
			<input
				type="number"
				placeholder={placeholder}
				onChange={onChange}
				className={styles.inputForm}
			/>
		</div>
	);
}

export default Input;
