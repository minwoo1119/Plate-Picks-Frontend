import styles from "./header.module.scss";

type HeaderProps = {
	align?: "center" | "left";
	description?: string;
	text: string;
};

function Header({
	align = "left",
	description,
	text,
}: HeaderProps) {
	return (
		<header className={`${styles.container} ${styles[align]}`}>
			<h1 className={styles.title}>{text}</h1>
			{description && <p className={styles.description}>{description}</p>}
		</header>
	);
}

export default Header;
