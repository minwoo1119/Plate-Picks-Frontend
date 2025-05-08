import styles from "./header.module.scss";

type HeaderProps = {
	text: string;
};

function Header({ text }: HeaderProps) {
	return (
		<div className={styles.container}>
			<div>{text}</div>
		</div>
	);
}

export default Header;
