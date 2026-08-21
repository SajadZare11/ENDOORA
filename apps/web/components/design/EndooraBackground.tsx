import styles from './endoora-design.module.css';

export default function EndooraBackground({children}:{children:React.ReactNode}){
 return <div className={styles.background}>{children}</div>;
}
