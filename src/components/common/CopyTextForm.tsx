import { Copy } from "lucide-react";
import styles from "./copyTextForm.module.scss";

type CopyTextFormProps = {
	text: string;
};

function CopyTextForm({ text }: CopyTextFormProps) {
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			window.alert("복사되었습니다.");
		} catch (err) {
			window.alert("복사에 실패했습니다.");
			console.error("Failed to copy: ", err);
		}
	};
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.label}>Invite Code</div>
				<div className={styles.text}>{text}</div>
			</div>
			<button className={styles.copyButton} onClick={handleCopy} type="button">
				<Copy className={styles.copyIcon} />
			</button>
		</div>
	);
}

export default CopyTextForm;
