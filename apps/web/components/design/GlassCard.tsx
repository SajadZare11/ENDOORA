import styles from './endoora-design.module.css';

export default function GlassCard({children,className=''}:{children:React.ReactNode;className?:string}){
 return <section className={`${styles.card} ${className}`}>{children}</section>;
}
