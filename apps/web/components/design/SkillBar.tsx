import styles from './endoora-design.module.css';
export default function SkillBar({name,value}:{name:string;value:number}){
 return <div className={styles.skill}><span>{name}</span><div><i style={{width:`${value}%`}}/></div></div>
}
