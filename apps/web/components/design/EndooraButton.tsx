import styles from './endoora-design.module.css';

export default function EndooraButton({children,disabled,onClick}:{children:React.ReactNode;disabled?:boolean;onClick?:()=>void}){
 return <button disabled={disabled} onClick={onClick} className={styles.button}>{children}</button>;
}
