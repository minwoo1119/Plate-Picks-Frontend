import styles from "./header.module.scss";

type HeaderProps = {
	text: string;
};

function Header({ text }: HeaderProps) {
	return (
		<header className={styles.container}>
			<h1 className={styles.title}>{text}</h1>
		</header>
	);
}

export default Header;
