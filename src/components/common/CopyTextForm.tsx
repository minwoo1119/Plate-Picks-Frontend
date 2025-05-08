import { Copy } from "lucide-react";
import styles from "./copyTextForm.module.scss";

type CopyTextFormProps = {
	text: string;
};

function CopyTextForm({ text }: CopyTextFormProps) {
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			alert("복사되었습니다.");
		} catch (err) {
			alert("복사에 실패했습니다.");
			console.error("Failed to copy: ", err);
		}
	};
	return (
		<div className={styles.container}>
			<div className={styles.text}>{text}</div>
			<Copy className={styles.copyIcon} onClick={handleCopy} />
		</div>
	);
}

export default CopyTextForm;
