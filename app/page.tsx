"use client";

import { useMemo, useState } from "react";

type Kind = "event" | "raid" | "max";
type Schedule = { id:string; title:string; kind:Kind; start:string; end:string; dateLabel:string; detail:string; accent:string; source?:string };

const schedules: Schedule[] = [
  { id:"go-pass", title:"GO패스: 8월", kind:"event", start:"2026-08-04T10:00:00+09:00", end:"2026-09-08T10:00:00+09:00", dateLabel:"8.4 (화) 10:00 – 9.8 (화) 10:00", detail:"라티아스 조우, 교환 사탕 보너스, 선물 한도 증가, 일일 모험향로 지속시간 2배 등 단계별 보너스", accent:"violet", source:"https://pokemongo.com/en/news/go-pass-august-2026" },
  { id:"summer-marathon", title:"서머 마라톤: 북극의 불씨", kind:"event", start:"2026-08-04T10:00:00+09:00", end:"2026-08-10T20:00:00+09:00", dateLabel:"8.4 (화) 10:00 – 8.10 (월) 20:00", detail:"색이 다른 누니머기 첫 등장. 불꽃·얼음 테마 야생 포켓몬과 5km 알, 이벤트 GO패스 진행", accent:"orange", source:"https://pokemongo.com/news/summer-marathon-2026" },
  { id:"hatch-day", title:"불꽃과 얼음 부화 데이", kind:"event", start:"2026-08-08T11:00:00+09:00", end:"2026-08-08T17:00:00+09:00", dateLabel:"8.8 (토) 11:00 – 17:00", detail:"뽀뽀라와 마그비가 2km 알에서 더 자주 부화. 부화 사탕 2배, 부화 거리 1/2", accent:"rose", source:"https://pokemongo.com/news/fire-and-ice-hatch-day-2026" },
  { id:"community-day", title:"훔처우 커뮤니티 데이", kind:"event", start:"2026-08-16T14:00:00+09:00", end:"2026-08-16T17:00:00+09:00", dateLabel:"8.16 (일) 14:00 – 17:00", detail:"훔처우 대량 발생. 포획 별의모래 3배·사탕 2배. 21시까지 진화하면 폭슬라이가 얼어붙는바람 습득", accent:"amber", source:"https://pokemongo.com/news/communityday-august-2026-nickit" },
  { id:"water-festival", title:"울트라 언록: 워터 페스티벌", kind:"event", start:"2026-08-18T10:00:00+09:00", end:"2026-08-24T20:00:00+09:00", dateLabel:"8.18 (화) 10:00 – 8.24 (월) 20:00", detail:"찌로꼬치·꼬치조와 윽우지 첫 등장. 후반부에는 포획 XP 4배·별의모래 5배", accent:"blue", source:"https://pokemongo.com/en/news/water-festival-2026" },
  { id:"starmie-day", title:"메가 아쿠스타 슈퍼 메가 레이드 데이", kind:"raid", start:"2026-08-22T11:00:00+09:00", end:"2026-08-22T17:00:00+09:00", dateLabel:"8.22 (토) 11:00 – 17:00", detail:"메가 아쿠스타 첫 등장. 무료 레이드패스 최대 6장, 레이드 XP 5,000 추가, 색이 다른 아쿠스타 확률 증가", accent:"cyan", source:"https://pokemongo.com/en/news/starmie-super-mega-raid-day-2026" },
  { id:"mega-finale", title:"Pokémon GO Fest 2026: 메가 피날레", kind:"event", start:"2026-09-05T00:00:00+09:00", end:"2026-09-06T23:59:59+09:00", dateLabel:"9.5 (토) – 9.6 (일)", detail:"2026 GO Fest 시즌을 마무리하는 글로벌 이벤트. 상세 내용은 공식 발표 후 갱신 예정", accent:"indigo", source:"https://pokemongo.com/news/gofest2026-finale-save-the-date" },
];

const raids = [
  { dates:"7.29 – 8.4", five:"큐레무", mega:"메가 보스로라" },
  { dates:"8.5 – 8.11", five:"유크시 (아시아·태평양)", mega:"메가 번치코" },
  { dates:"8.12 – 8.18", five:"그란돈", mega:"메가 한카리아스" },
  { dates:"8.19 – 8.25", five:"루나아라", mega:"메가 대짱이" },
  { dates:"8.26 – 9.8", five:"레지락 · 레지아이스 · 레지스틸", mega:"메가 갸라도스" },
];

const calendarItems: Record<number,{text:string;kind:Kind}[]> = {
  3:[{text:"다이맥스 마그마",kind:"max"}], 5:[{text:"레이드 아워",kind:"raid"}], 6:[{text:"딜리버드 스포트라이트",kind:"event"}], 8:[{text:"불꽃과 얼음 부화 데이",kind:"event"}], 10:[{text:"다이맥스 메탕",kind:"max"}], 12:[{text:"레이드 아워",kind:"raid"}], 13:[{text:"개무소 스포트라이트",kind:"event"}], 16:[{text:"훔처우 커뮤니티 데이",kind:"event"}], 17:[{text:"다이맥스 잉어킹",kind:"max"}], 19:[{text:"레이드 아워",kind:"raid"}], 20:[{text:"잉어킹 스포트라이트",kind:"event"}], 22:[{text:"메가 아쿠스타 레이드 데이",kind:"raid"}], 24:[{text:"다이맥스 카포에라",kind:"max"}], 26:[{text:"레이드 아워",kind:"raid"}], 27:[{text:"망키 스포트라이트",kind:"event"}], 31:[{text:"다이맥스 이브이",kind:"max"}],
};

const calendarBars:{id:string;label:string;kind:Kind;row:number;start:number;end:number;lane:number;edge:"start"|"middle"|"end"|"single"}[] = [
  {id:"pass-1",label:"GO패스: 8월",kind:"event",row:2,start:3,end:8,lane:0,edge:"start"},
  {id:"pass-2",label:"GO패스: 8월 계속",kind:"event",row:3,start:1,end:8,lane:0,edge:"middle"},
  {id:"pass-3",label:"GO패스: 8월 계속",kind:"event",row:4,start:1,end:8,lane:0,edge:"middle"},
  {id:"pass-4",label:"GO패스: 8월 계속",kind:"event",row:5,start:1,end:8,lane:0,edge:"middle"},
  {id:"pass-5",label:"GO패스: 8월 계속",kind:"event",row:6,start:1,end:3,lane:0,edge:"end"},
  {id:"summer-1",label:"서머 마라톤: 북극의 불씨",kind:"event",row:2,start:3,end:8,lane:1,edge:"start"},
  {id:"summer-2",label:"서머 마라톤 종료 20:00",kind:"event",row:3,start:1,end:2,lane:1,edge:"end"},
  {id:"water-1",label:"울트라 언록: 워터 페스티벌",kind:"event",row:4,start:3,end:8,lane:1,edge:"start"},
  {id:"water-2",label:"워터 페스티벌 종료 20:00",kind:"event",row:5,start:1,end:2,lane:1,edge:"end"},
  {id:"uxie-1",label:"★5 유크시",kind:"raid",row:2,start:4,end:8,lane:2,edge:"start"},
  {id:"uxie-2",label:"★5 유크시",kind:"raid",row:3,start:1,end:3,lane:2,edge:"end"},
  {id:"groudon-1",label:"★5 그란돈",kind:"raid",row:3,start:4,end:8,lane:2,edge:"start"},
  {id:"groudon-2",label:"★5 그란돈",kind:"raid",row:4,start:1,end:4,lane:2,edge:"end"},
  {id:"lunala-1",label:"★5 루나아라",kind:"raid",row:4,start:4,end:8,lane:2,edge:"start"},
  {id:"lunala-2",label:"★5 루나아라",kind:"raid",row:5,start:1,end:3,lane:2,edge:"end"},
  {id:"regi-1",label:"★5 레지 3종",kind:"raid",row:5,start:4,end:8,lane:2,edge:"start"},
  {id:"regi-2",label:"★5 레지 3종 계속",kind:"raid",row:6,start:1,end:8,lane:2,edge:"middle"},
];

const filters:{key:"all"|Kind;label:string;icon:string}[] = [
  {key:"all",label:"전체",icon:"✦"},{key:"event",label:"이벤트",icon:"●"},{key:"raid",label:"레이드",icon:"◆"},{key:"max",label:"맥스배틀",icon:"▲"},
];

function getState(item:Schedule){ const now=new Date(),start=new Date(item.start),end=new Date(item.end); if(now<start)return{label:"예정",className:"upcoming"}; if(now<=end)return{label:"진행 중",className:"live"}; return{label:"종료",className:"ended"}; }

export default function Home(){
  const [filter,setFilter]=useState<"all"|Kind>("all"); const [view,setView]=useState<"calendar"|"list">("calendar");
  const visible=useMemo(()=>schedules.filter(i=>filter==="all"||i.kind===filter),[filter]); const days=Array.from({length:42},(_,i)=>i-4);
  return <main>
    <header className="topbar"><a className="brand" href="#top" aria-label="포켓몬고 이벤트 캘린더 홈"><span className="brand-ball" aria-hidden="true"/><span>GO 일정</span></a><nav aria-label="주요 메뉴"><a href="#calendar">달력</a><a href="#raids">레이드</a><a href="#events">이벤트</a></nav><span className="timezone">대한민국 시간 · KST</span></header>
    <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow"><span/> 2026년 8월 최신 일정</p><h1>이번 달의 모험을<br/><em>놓치지 마세요.</em></h1><p className="hero-text">이벤트부터 레이드 보스 변경까지,<br/>한국 시간 기준으로 한눈에 확인하세요.</p><div className="hero-actions"><a className="primary-button" href="#calendar">8월 일정 보기 <span>↓</span></a><a className="text-button" href="#raids">레이드 변경표 보기 <span>→</span></a></div></div><div className="hero-orbit" aria-hidden="true"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="hero-ball"/><span className="spark spark-a">✦</span><span className="spark spark-b">✧</span><span className="spark spark-c">✦</span></div></section>
    <section className="content" id="calendar"><div className="section-heading"><div><p className="eyebrow dark"><span/> Monthly schedule</p><h2>2026년 8월</h2></div><div className="view-switch" aria-label="보기 방식"><button className={view==="calendar"?"active":""} onClick={()=>setView("calendar")}>달력</button><button className={view==="list"?"active":""} onClick={()=>setView("list")}>목록</button></div></div>
      <div className="filter-row" aria-label="일정 종류 필터">{filters.map(i=><button key={i.key} className={filter===i.key?"active":""} onClick={()=>setFilter(i.key)}><span className={`filter-icon ${i.key}`}>{i.icon}</span>{i.label}</button>)}</div>
      {view==="calendar"?<div className="calendar-shell"><div className="weekdays">{["일","월","화","수","목","금","토"].map(d=><span key={d}>{d}</span>)}</div><div className="calendar-grid">{days.map((day,index)=>{const inMonth=day>=1&&day<=31;const shown=inMonth?(calendarItems[day]||[]).filter(i=>filter==="all"||i.kind===filter):[];const display=day<=0?31+day:day>31?day-31:day;return <div style={{gridColumn:index%7+1,gridRow:Math.floor(index/7)+1}} className={`day-cell ${inMonth?"":"muted"} ${day===13?"today":""}`} key={index}><span className="day-number">{display}</span>{shown.map((i,n)=><span className={`calendar-chip ${i.kind}`} key={`${i.text}-${n}`}>{i.text}</span>)}</div>})}{calendarBars.filter(bar=>filter==="all"||bar.kind===filter).map(bar=><span key={bar.id} title={bar.label} className={`range-bar ${bar.kind} ${bar.edge}`} style={{gridColumn:`${bar.start} / ${bar.end}`,gridRow:bar.row,marginTop:30+bar.lane*17}}>{bar.label}</span>)}</div></div>:<ScheduleList items={visible}/>}<div className="legend"><span><i className="event"/> 이벤트</span><span><i className="raid"/> 레이드</span><span><i className="max"/> 맥스배틀</span><span className="notice">긴 일정은 날짜 범위 전체에 바로 표시됩니다.</span></div>
    </section>
    <section className="raid-section" id="raids"><div className="raid-heading"><div><p className="eyebrow light"><span/> Raid rotation</p><h2>레이드 보스 변경 일정</h2><p>매주 수요일 오전 10시, 새로운 보스가 등장합니다.</p></div><div className="raid-badge"><span>주말 그림자 레이드</span><strong>그림자 기라티나<br/>(어나더폼)</strong></div></div><div className="raid-table" role="table" aria-label="레이드 보스 변경 일정"><div className="raid-row raid-table-head" role="row"><span>기간</span><span>전설 레이드 ★5</span><span>메가 레이드</span></div>{raids.map((r,i)=><div className={`raid-row ${i===2?"current":""}`} role="row" key={r.dates}><span className="raid-date">{r.dates}{i===2&&<b>현재</b>}</span><span><i className="mini-ball legendary"/>{r.five}</span><span><i className="mini-ball mega"/>{r.mega}</span></div>)}</div><p className="raid-note">레이드 아워: 매주 수요일 18:00–19:00 · 현장 레이드 완료 시 이상한사탕 XL 1개</p></section>
    <section className="events-section" id="events"><div className="section-heading"><div><p className="eyebrow dark"><span/> Featured events</p><h2>주요 이벤트</h2></div><a href="#calendar" className="text-button">달력으로 돌아가기 <span>↑</span></a></div><ScheduleList items={visible} detailed/></section>
    <footer><div className="brand"><span className="brand-ball small" aria-hidden="true"/><span>GO 일정</span></div><p>팬이 만든 비공식 일정표입니다. 게임 내 공지와 공식 Pokémon GO 안내를 함께 확인해 주세요.</p><p className="updated">최종 확인 · 2026.08.13 KST</p></footer>
  </main>;
}

function ScheduleList({items,detailed=false}:{items:Schedule[];detailed?:boolean}){return <div className={`schedule-list ${detailed?"":"compact"}`}>{items.map(item=>{const state=getState(item);return <article className="schedule-card" key={item.id}><span className={`event-mark ${item.accent}`}/><div><div className="card-top"><span className={`state ${state.className}`}>{state.label}</span><span className="card-date">{item.dateLabel}</span></div><h3>{item.title}</h3><p>{item.detail}</p>{detailed&&item.source&&<a href={item.source} target="_blank" rel="noreferrer">공식 안내 보기 <span>↗</span></a>}</div></article>})}</div>}
