"use client";
import {useState} from 'react';
import EndooraBackground from '@/components/design/EndooraBackground';
import GlassCard from '@/components/design/GlassCard';
import PlacementQuestion from '@/components/placement/PlacementQuestion';
import LearnerTwinPreview from '@/components/placement/LearnerTwinPreview';
import styles from '@/components/placement/placement.module.css';

const questions=[{section:'Grammar',question:'She ___ to school every day.',options:['go','goes','going','gone']},{section:'Vocabulary',question:'A place where you borrow books is a...',options:['library','kitchen','garden','station']},{section:'Reading',question:'Ali studies English every evening because he wants to travel. Why does Ali study English?',options:['Travel','Cooking','Sports','Work']}];
export default function PlacementPage(){const [i,setI]=useState(0);const [s,setS]=useState('');const q=questions[i];function next(){if(i<questions.length-1){setI(i+1);setS('')}else alert('آزمون تمام شد')}return <EndooraBackground><div className={styles.container}><GlassCard><div className={styles.hero}><p>✨ Endoora Placement Experience</p><h1>مسیر انگلیسی خودت را بشناس</h1><p>Endoora سطح واقعی تو را بررسی می‌کند و مسیر یادگیری شخصی تو را می‌سازد.</p></div></GlassCard><div className={styles.grid}><PlacementQuestion question={q} index={i} total={questions.length} selected={s} setSelected={setS} next={next}/><LearnerTwinPreview/></div></div></EndooraBackground>}
