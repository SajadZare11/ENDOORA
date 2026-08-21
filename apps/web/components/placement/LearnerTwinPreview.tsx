import SkillBar from '@/components/design/SkillBar';
import styles from './placement.module.css';
export default function LearnerTwinPreview(){return <div className={styles.twin}><h2>Learner Twin</h2><p>پروفایل یادگیری تو بعد از آزمون ساخته می‌شود.</p><SkillBar name="Grammar" value={70}/><SkillBar name="Vocabulary" value={60}/><SkillBar name="Listening" value={55}/></div>}
