import React, {useEffect, useMemo, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap} from 'react-leaflet';
import L from 'leaflet';
import { detectFlightDirection, getFlightDirectionLabel } from './flightUtils.js';

const planes0=[
 {id:1,flight:'CC101',from:'London',to:'Lagos',lat:11.2,lng:4.6,alt:34000,speed:485,heading:200,status:'Approaching'},
 {id:2,flight:'CC205',from:'Abuja',to:'Lagos',lat:9.1,lng:7.5,alt:28000,speed:455,heading:190,status:'Approaching'},
 {id:3,flight:'CC310',from:'Dubai',to:'Lagos',lat:15.8,lng:12.5,alt:36000,speed:510,heading:205,status:'Approaching'},
 {id:4,flight:'CC412',from:'Paris',to:'Lagos',lat:11.4,lng:4.7,alt:31000,speed:470,heading:175,status:'Approaching'},
 {id:5,flight:'CC522',from:'Johannesburg',to:'Lagos',lat:-4.2,lng:18.5,alt:33000,speed:490,heading:345,status:'Approaching'},
 {id:6,flight:'CC601',from:'New York',to:'Lagos',lat:23.4,lng:-22.2,alt:37000,speed:520,heading:95,status:'Approaching'},
 {id:7,flight:'CC720',from:'Accra',to:'Lagos',lat:5.7,lng:-0.2,alt:24000,speed:430,heading:215,status:'Approaching'},
 {id:8,flight:'CC880',from:'Dubai',to:'Lagos',lat:13.6,lng:10.2,alt:28000,speed:405,heading:185,status:'Approaching'}
];

const airports=[
 {code:'LOS',name:'Murtala Muhammed International',lat:6.5774,lng:3.3212},
 {code:'ABV',name:'Nnamdi Azikiwe International',lat:9.0068,lng:7.2632},
 {code:'ACC',name:'Kotoka International',lat:5.6052,lng:-0.1668},
 {code:'LHR',name:'London Heathrow',lat:51.47,lng:-0.4543},
 {code:'DXB',name:'Dubai International',lat:25.2532,lng:55.3657}
];

function planeIcon(heading){return L.divIcon({className:'plane-icon',html:`<span style="transform:rotate(${heading}deg)">✈</span>`,iconSize:[30,30],iconAnchor:[15,15]});}
function FlyTo({selected}){const map=useMap(); useEffect(()=>{if(selected)map.flyTo([selected.lat,selected.lng],5,{duration:.8})},[selected,map]); return null;}
function getPlaneStatus(plane){
 const direction=detectFlightDirection(plane);
 if(direction==='coming') return 'Approaching Lagos';
 if(direction==='going') return 'Departing Lagos';
 return plane.status || 'Cruising';
}

export default function App(){
 const [planes,setPlanes]=useState(planes0),[query,setQuery]=useState(''),[selected,setSelected]=useState(null),[tab,setTab]=useState('radar');
 useEffect(()=>{const t=setInterval(()=>setPlanes(p=>p.map(x=>({...x,lat:x.lat+Math.sin(x.heading*Math.PI/180)*.045,lng:x.lng+Math.cos(x.heading*Math.PI/180)*.045}))),1500);return()=>clearInterval(t)},[]);
 const filtered=useMemo(()=>planes.filter(p=>{
   const text=(p.flight+' '+p.from+' '+p.to).toLowerCase();
   const matchesQuery=text.includes(query.toLowerCase());
   const direction=detectFlightDirection(p);
   const matchesTab=tab==='radar'||(tab==='departures'&&direction==='going')||(tab==='arrivals'&&direction==='coming');
   return matchesQuery && matchesTab;
 }),[planes,query,tab]);
 return <div className="app">
  <header><div className="brand"><span className="logo">✈</span><div><b>Airport Radar</b><small>LIVE FLIGHT TRACKER</small></div></div>
   <div className="live"><i/> LIVE DATA</div>
   <input className="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search flight, origin or destination..."/>
  </header>
  <div className="body">
   <aside>
    <button className={tab==='radar'?'active':''} onClick={()=>setTab('radar')}>◉ Radar</button>
    <button className={tab==='departures'?'active':''} onClick={()=>setTab('departures')}>↗ Departures</button>
    <button className={tab==='arrivals'?'active':''} onClick={()=>setTab('arrivals')}>↙ Arrivals</button>
    <div className="side-title">AIRCRAFT ({filtered.length})</div>
    {filtered.map(p=>{const direction=detectFlightDirection(p); const directionLabel=getFlightDirectionLabel(p); return <div className={'flight '+(selected?.id===p.id?'chosen':'')} onClick={()=>setSelected(p)} key={p.id}><b>{p.flight}</b><span>{p.from} → {p.to}</span><small>{directionLabel} · {p.alt.toLocaleString()} ft · {p.speed} kt</small></div>;})}
   </aside>
   <main>
    <div className="radar-sweep" />
    <div className="radar-overlay" />
    <MapContainer center={[8,5]} zoom={3} minZoom={2} maxZoom={12} className="map">
     <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
     <FlyTo selected={selected}/>
     {airports.map(a=><CircleMarker key={a.code} center={[a.lat,a.lng]} radius={6} pathOptions={{color:'#7ef7b5',fillColor:'#7ef7b5',fillOpacity:1}}><Popup><b>{a.code}</b><br/>{a.name}</Popup></CircleMarker>)}
     {filtered.map(p=><Marker key={p.id} position={[p.lat,p.lng]} icon={planeIcon(p.heading)} eventHandlers={{click:()=>setSelected(p)}}><Popup><b>{p.flight}</b><br/>{p.from} → {p.to}<br/>{getFlightDirectionLabel(p)} · {p.alt.toLocaleString()} ft · {p.speed} kt</Popup></Marker>)}
    </MapContainer>
    <div className="map-label">◉ {filtered.length} aircraft tracked · {Array.from(new Set(filtered.map(p=>detectFlightDirection(p)).filter(Boolean))).length} active flight directions</div>
   </main>
   {selected&&<section className="details"><button className="close" onClick={()=>setSelected(null)}>×</button><div className="bigplane">✈</div><h2>{selected.flight}</h2><p className="route">{selected.from} → {selected.to}</p><div className="status">● {getPlaneStatus(selected)}</div><div className="stats"><div><span>ALTITUDE</span><b>{selected.alt.toLocaleString()} ft</b></div><div><span>SPEED</span><b>{selected.speed} kt</b></div><div><span>HEADING</span><b>{selected.heading}°</b></div></div><hr/><p><b>Direction</b><br/>{getFlightDirectionLabel(selected)}</p><p><b>Last update</b><br/>Just now</p></section>}
  </div>
  <footer>Airport Radar · Demo mode · Connect an aviation API to replace simulated aircraft with live data.</footer>
 </div>
}
