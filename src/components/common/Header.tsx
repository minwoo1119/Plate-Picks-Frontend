import styles from "./header.module.scss";

type HeaderProps = {
	text: string;
	eyebrow?: string;
};

function Header({ text, eyebrow = "Plate Picks" }: HeaderProps) {
	return (
		<header className={styles.container}>
			<div className={styles.eyebrow}>{eyebrow}</div>
			<h1 className={styles.title}>{text}</h1>
		</header>
	);
}

export default Header;
