"use strict";
/* ---------- util ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store={
  get(k,d){try{const r=localStorage.getItem(k);return r?JSON.parse(r):d}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
  del(k){try{localStorage.removeItem(k)}catch(e){}}
};
const p2=n=>String(n).padStart(2,'0');
const p3=n=>String(n).padStart(3,'0');
const HARI=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const BULAN=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const ROMAN=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const ISO=/^\d{4}-\d{2}-\d{2}$/, HM=/^\d{2}:\d{2}$/;
const todayISO=()=>{const n=new Date();return n.getFullYear()+'-'+p2(n.getMonth()+1)+'-'+p2(n.getDate())};
const nextHour=()=>{const n=new Date();n.setMinutes(0,0,0);n.setHours(n.getHours()+1);return p2(n.getHours())+':00'};
const acadYear=()=>{const n=new Date(),y=n.getFullYear();return n.getMonth()>=7?y+'/'+(y+1):(y-1)+'/'+y};
const semJenis=()=>{const m=new Date().getMonth();return(m>=7||m===0)?'Semester Ganjil':'Semester Genap'};
/* format tanggal digital -> teks Indonesia */
const parts=i=>ISO.test(i||'')?i.split('-').map(Number):null;
const dl=i=>{const p=parts(i);return p?p[2]+' '+BULAN[p[1]-1]+' '+p[0]:''};
const dHari=i=>{const p=parts(i);return p?HARI[new Date(p[0],p[1]-1,p[2]).getDay()]:''};
const dRange=(a,b)=>{const p=parts(a),q=parts(b);if(!p)return'';if(!q||a===b)return dl(a);
  if(p[0]===q[0]&&p[1]===q[1])return p[2]+' - '+q[2]+' '+BULAN[p[1]-1]+' '+p[0];return dl(a)+' s.d. '+dl(b)};
const hRange=(a,b)=>{if(!parts(a))return'';if(!parts(b)||a===b)return dHari(a);return dHari(a)+' - '+dHari(b)};
function tzLabel(){try{const z=Intl.DateTimeFormat().resolvedOptions().timeZone;return({'Asia/Jakarta':'WIB','Asia/Pontianak':'WIB','Asia/Makassar':'WITA','Asia/Jayapura':'WIT'})[z]||''}catch(e){return''}}
const TZ=tzLabel()||'WIB';
const tm=(a,b)=>{if(!HM.test(a||''))return'';let t=a.replace(':','.')+' '+TZ;t+=HM.test(b||'')?' s.d. '+b.replace(':','.')+' '+TZ:' s.d. selesai';return t};
let toastT;
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove('on'),3000)}

/* ---------- ikon ---------- */
const IC={
 user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
 alert:'<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
 clip:'<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M8 12h8M8 16h5"/>',
 eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
 bag:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
 cap:'<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 2.5 9 2.5 12 0v-5"/>',
 uplus:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
 users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 hist:'<path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/>',
 set:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
 moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
 sun:'<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
 back:'<path d="M19 12H5M11 18l-6-6 6-6"/>',
 x:'<path d="M18 6 6 18M6 6l12 12"/>',
 print:'<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>'
};
const ico=n=>'<svg viewBox="0 0 24 24">'+IC[n]+'</svg>';

/* ---------- logo (SVG inline) ---------- */
let logoN=0;
function logo(text){
  const id='lp'+(++logoN);
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><path id="${id}" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs>
  <circle cx="50" cy="50" r="49" fill="#1a3a8f"/>
  <circle cx="50" cy="50" r="30" fill="#fff"/>
  <path d="M27 60c-6-9-5-20 3-28M30 32c-3 6-3 14 1 21" fill="none" stroke="#f2c500" stroke-width="5" stroke-linecap="round"/>
  <path d="M73 60c6-9 5-20-3-28" fill="none" stroke="#1c6b3a" stroke-width="5" stroke-linecap="round" stroke-dasharray="3 3"/>
  <polygon points="50,28 68,48 50,68 32,48" fill="#1a3a8f"/>
  <polygon points="36,50 50,62 64,50 50,58" fill="#d5262b"/>
  <polygon points="50,55 62,50 50,66 38,50" fill="#1c9a4a"/>
  <circle cx="50" cy="45" r="3" fill="#fff"/>
  <text font-family="Times New Roman,serif" font-size="8.6" font-weight="700" fill="#fff"><textPath href="#${id}" startOffset="0" textLength="232" lengthAdjust="spacing">${esc(text)}</textPath></text>
  </svg>`;
}

/* ---------- fakultas ---------- */
const FACS={
 fikes:{id:'fikes',name:'Fakultas Ilmu Kesehatan',short:'FIKES',kode:'FIKES',pri:'#0b4fb3',pri2:'#062f73',acc:'#7fd0ff',prodi:'S1 Gizi',prodi2:'Kesehatan Masyarakat',inst:'Kepala Dinas Kesehatan'},
 fik:{id:'fik',name:'Fakultas Ilmu Keislaman',short:'FIK',kode:'FIK',pri:'#0d7a4f',pri2:'#054530',acc:'#8ff0c0',prodi:'Pendidikan Agama Islam',prodi2:'Hukum Keluarga Islam',inst:'Kepala Kantor Kementerian Agama'},
 fkip:{id:'fkip',name:'Fakultas Keguruan dan Ilmu Pendidikan',short:'FKIP',kode:'FKIP',pri:'#9b2242',pri2:'#5a1026',acc:'#ffb3c6',prodi:'PGSD',prodi2:'Pendidikan Bahasa Inggris',inst:'Kepala Dinas Pendidikan'},
 ftek:{id:'ftek',name:'Fakultas Teknik',short:'FTEK',kode:'FTEK',pri:'#c5580a',pri2:'#6e2f03',acc:'#ffd08a',prodi:'Teknik Informatika',prodi2:'Teknik Sipil',inst:'Kepala Dinas Komunikasi dan Informatika'}
};
let F=FACS.fikes;
const univ='Universitas Islam Al-Ihya Kuningan';

/* ======================================================================
   PENGATURAN BAWAAN — berlaku untuk SEMUA pengunjung situs ini.
   Nilai di bawah ini tersimpan di dalam kode (bukan di penyimpanan
   browser), jadi inilah yang dilihat siapa pun yang membuka link
   SIPEKA ini pertama kali. Beda dengan menu "Pengaturan" di dalam
   aplikasi, yang hanya menyimpan perubahan di perangkat masing-masing
   orang. Edit nilai di bawah ini SEBELUM situsnya dibagikan/dipasang,
   supaya semua pengunjung (bukan cuma kamu) melihat data yang benar.
   ====================================================================== */
const DEFAULT_WA='';                 // nomor WhatsApp admin, format 628xxxxxxxxxx (tanpa + atau spasi)
const DEFAULT_KOTA='Kuningan';       // kota titimangsa
const DEFAULT_JAM='Senin – Jumat, 08.00 – 15.00 WIB';   // jam layanan yang tampil di beranda
const DEFAULT_LOKASI='Kantor Tata Usaha, Kampus 1 UNISA Kuningan'; // lokasi/ruang layanan

/* ---------- pengaturan (per fakultas) ---------- */
const defFac=f=>({dekan:'Nama Dekan, gelar',nidn:'',alamat:'Kampus 1 Jl. Mayasih No. 11 Kuningan, Jawa Barat',status:'Terakreditasi',kode:f.kode});
function loadCfg(){
  const cfg={kota:DEFAULT_KOTA,wa:DEFAULT_WA,jam:DEFAULT_JAM,lokasi:DEFAULT_LOKASI,fac:'fikes',f:{}};
  const old=store.get('sipeka:cfg',null),c=store.get('sipeka:cfg2',null);
  if(old){['kota','wa'].forEach(k=>{if(old[k])cfg[k]=old[k]});cfg.f.fikes={};['dekan','nidn','alamat','status'].forEach(k=>{if(old[k])cfg.f.fikes[k]=old[k]})}
  if(c){Object.keys(c).forEach(k=>{if(c[k]!==undefined)cfg[k]=c[k]})}
  Object.keys(FACS).forEach(id=>{cfg.f[id]=Object.assign(defFac(FACS[id]),cfg.f[id]||{})});
  if(!FACS[cfg.fac])cfg.fac='fikes';
  return cfg;
}
let CFG=loadCfg();
const FC=()=>CFG.f[F.id];
const saveCfg=()=>store.set('sipeka:cfg2',CFG);


/* ---------- pembantu templat surat ---------- */
const dots='……………………………';
const dotHtml='<span class="dot">'+dots+'</span>';
const v=x=>(x&&String(x).trim())?esc(String(x).trim()).replace(/\n/g,'<br>'):dotHtml;
const b=x=>'<b>'+v(x)+'</b>';
const joinv=(...a)=>v(a.filter(x=>x&&String(x).trim()).join(' '));
const kv=rows=>'<table class="kv">'+rows.map(r=>`<tr><td class="k">${r[0]}</td><td class="c">:</td><td>${r[1]}</td></tr>`).join('')+'</table>';
const mtable=(list,cols)=>{const rows=(list&&list.length)?list:[{}];return `<table class="grid"><thead><tr><th style="width:38px">No</th>${cols.map(c=>`<th>${c[0]}</th>`).join('')}</tr></thead><tbody>${rows.map((r,i)=>`<tr><td class="ctr">${i+1}</td>${cols.map(c=>`<td>${v(c[2]==='d'?dl(r[c[1]]):r[c[1]])}</td>`).join('')}</tr>`).join('')}</tbody></table>`};
const head=(no,perihal,kepada,di)=>`<table class="kv nomor"><tr><td class="k">Nomor</td><td class="c">:</td><td>${esc(no)}</td></tr><tr><td class="k">Lampiran</td><td class="c">:</td><td>-</td></tr><tr><td class="k">Perihal</td><td class="c">:</td><td><b>${perihal}</b></td></tr></table><p class="yth">Kepada Yth.<br><b>${kepada}</b><br>di<br><span class="tab">${di||'Tempat'}</span></p>`;
const salam='<p>Assalamu’alaikum Wr. Wb.</p>';
const tutup='<p>Wassalamu’alaikum Wr. Wb.</p>';
const sign=tgl=>`<div class="sign"><div>${parts(tgl)?esc(CFG.kota+', '+dl(tgl)):dotHtml}</div><div>Dekan,</div><div class="sp"></div><div><b><u>${esc(FC().dekan)}</u></b></div>${FC().nidn?`<div>NIDN. ${esc(FC().nidn)}</div>`:''}</div>`;
const ph=s=>(s||'').replace(/\{PRODI2\}/g,F.prodi2).replace(/\{PRODI\}/g,F.prodi).replace(/\{INST\}/g,F.inst).replace(/\{FAC\}/g,F.name);
const facTxt=()=>`${F.name} ${univ}`;

/* ---------- definisi field ---------- */
const NO={k:'no',type:'no',l:'No. Surat (Hubungi Tata Usaha):'};
const T=(k,l,p,o)=>Object.assign({k,l,p,type:'text'},o||{});
const TA=(k,l,p)=>({k,l,p,type:'area'});
const DT=(k,l,def)=>({k,l,type:'date',def:def===undefined?todayISO:def});
const TM=(k,l,def)=>({k,l,type:'time',def:def===undefined?nextHour:def});
const TGL=()=>DT('tgl','Tanggal Titimangsa Surat:');
const MHS3=[T('nama','Nama Mahasiswa:','Contoh: Raffa Alviansyah'),T('nim','NIM:','Contoh: 22233101017'),T('prodi','Program Studi:','Contoh: {PRODI}')];

const examSvc=(id,title,desc,label,icon)=>({id,title,desc,icon,prefix:'B',
  fields:[NO,TGL(),T('kepada','Ditujukan Kepada:','Contoh: Ketua Program Studi {PRODI}'),
    T('nama','Nama Mahasiswa:','Contoh: Raffa Alviansyah'),T('nim','NIM Mahasiswa:','Contoh: 22233101017'),T('prodi','Program Studi:','Contoh: {PRODI}'),
    TA('judul','Judul Skripsi:','Tuliskan judul lengkap skripsi disini...'),
    T('pb1','Pembimbing I:','Contoh: Dr. Nama Dosen, M.Pd'),T('pb2','Pembimbing II:','Contoh: Nama Dosen, M.Pd'),
    DT('tglp','Tanggal Pelaksanaan:'),TM('pukul','Pukul Mulai:'),TM('pukulE','Sampai Pukul (kosongkan = selesai):',''),
    T('tempat','Tempat / Media:','Contoh: Ruang Sidang Fakultas / Zoom Meeting')],
  render:(d,no)=>head(no,'Permohonan '+label,v(d.kepada))+salam+
   `<p class="ind">Sehubungan dengan telah terpenuhinya persyaratan akademik, dengan ini kami mengajukan permohonan pelaksanaan <b>${label}</b> bagi mahasiswa ${facTxt()} sebagai berikut:</p>`+
   kv([['Nama',v(d.nama)],['NIM',v(d.nim)],['Program Studi',v(d.prodi)],['Judul',b(d.judul)],['Pembimbing I',v(d.pb1)],['Pembimbing II',v(d.pb2)]])+
   `<p class="ind">Adapun pelaksanaan ${label} direncanakan pada:</p>`+
   kv([['Hari',v(dHari(d.tglp))],['Tanggal',v(dl(d.tglp))],['Pukul',v(tm(d.pukul,d.pukulE))],['Tempat',v(d.tempat)]])+
   `<p class="ind">Demikian permohonan ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.</p>`+tutup+sign(d.tgl)});

const SV=[
 {id:'tugas',title:'Surat Tugas Dosen',desc:'Klik untuk membuat surat tugas',icon:'user',prefix:'ST',
  fields:[NO,DT('tgl','Tanggal Titimangsa:'),
   T('nama','Nama Penerima Tugas:','Contoh: Raffa Alviansyah, S.Kom'),T('nidn','NIDN:','Contoh: 123456'),T('hb','Home Base:','Contoh: {PRODI}'),
   T('unit','Unit Kerja:','Contoh: {FAC} UNISA Kuningan'),TA('keg','Nama Kegiatan / Webinar:','Contoh: Seminar nasional pendidikan'),
   DT('tglp','Tanggal Pelaksanaan:'),DT('tglp2','Sampai Tanggal (kosongkan bila 1 hari):',''),
   TM('pukul','Pukul Mulai:'),TM('pukulE','Sampai Pukul (kosongkan = selesai):',''),
   T('tempat','Tempat / Media Pelaksanaan:','Contoh: Zoom Meeting.'),T('penyel','Penyelenggara:','Contoh: UNISA Kuningan')],
  render:(d,no)=>`<div class="ttl">SURAT TUGAS</div><div class="nom">Nomor: ${esc(no)}</div>`+
   `<p class="ind">Dekan ${facTxt()}, dengan ini memberikan tugas kepada nama yang tertera di bawah ini:</p>`+
   kv([['Nama',v(d.nama)],['NIDN',v(d.nidn)],['Home Base',v(d.hb)],['Unit Kerja',v(d.unit)]])+
   `<p>Dengan ketentuan pelaksanaan sebagai berikut:</p>`+
   kv([['Kegiatan',b(d.keg)],['Hari',v(hRange(d.tglp,d.tglp2))],['Tanggal',v(dRange(d.tglp,d.tglp2))],['Pukul',v(tm(d.pukul,d.pukulE))],['Tempat',v(d.tempat)],['Penyelenggara',v(d.penyel)]])+
   `<p class="ind">Demikian surat tugas ini dibuat untuk dapat dilaksanakan dengan penuh tanggung jawab.</p>`+sign(d.tgl)},

 {id:'aktif',title:'Ket. Mahasiswa Aktif',desc:'Surat keterangan aktif kuliah',icon:'file',prefix:'KET',
  fields:[NO,DT('tgl','Tanggal Titimangsa Surat:'),
   T('nama','Nama Mahasiswa:','Contoh: Raffa Alviansyah'),T('nim','NIM Mahasiswa:','Contoh: 25263091002'),T('prodi','Program Studi:','Contoh: {PRODI}'),
   T('sem','Semester (Format Romawi & Teks):','Contoh: II (DUA)'),T('ortu','Nama Orang Tua:','Contoh: Raffa Alviansyah'),T('kerja','Pekerjaan Orang Tua:','Contoh: Wiraswasta'),
   T('jenis','Jenis Semester (Ganjil / Genap):','Contoh: Semester Genap',{def:semJenis}),T('ta','Tahun Akademik:','Contoh: 2026/2027',{def:acadYear})],
  render:(d,no)=>`<div class="ttl">SURAT KETERANGAN</div><div class="nom">Nomor: ${esc(no)}</div>`+
   `<p>Dekan ${facTxt()} menerangkan bahwa:</p>`+
   kv([['Nama',v(d.nama)],['Nomor Induk Mahasiswa',v(d.nim)],['Program Studi',v(d.prodi)],['Fakultas',esc(F.name.replace(/^Fakultas /,''))],['Semester',v(d.sem)]])+
   `<p style="margin-left:30px"><b><i>Anak dari :</i></b></p>`+kv([['Nama Orang Tua',v(d.ortu)],['Pekerjaan Orang Tua',v(d.kerja)]])+
   `<p class="ind">Nama tersebut di atas benar merupakan mahasiswa ${univ} terdaftar dan aktif kuliah pada ${v(d.jenis)} Tahun Akademik ${v(d.ta)}.</p>`+
   `<p class="ind">Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.</p>`+sign(d.tgl)},

 {id:'penelitian',title:'Pengantar Penelitian',desc:'Surat izin penelitian ilmiah',icon:'alert',prefix:'B',
  fields:[NO,DT('tgl','Tanggal Titimangsa Surat:'),T('jab','Jabatan Penerima Surat:','Contoh: {INST}'),T('inst','Nama Instansi / Kota Tujuan:','Contoh: Kabupaten Kuningan'),
   T('nama','Nama Mahasiswa:','Contoh: Raffa Alviansyah'),T('nim','NIM Mahasiswa:','Contoh: 22233091038'),T('prodi','Program Studi:','Contoh: {PRODI}'),TA('judul','Judul Penelitian Skripsi:','Tuliskan judul lengkap skripsi disini...')],
  render:(d,no)=>head(no,'Permohonan Izin Penelitian Skripsi',joinv(d.jab,d.inst))+salam+
   `<p class="ind">Sehubungan dengan pelaksanaan penelitian sebagai persyaratan penyelesaian studi mahasiswa ${facTxt()}, dengan ini kami mengajukan permohonan agar Bapak/Ibu berkenan memberikan izin kepada mahasiswa kami sebagai berikut:</p>`+
   kv([['Nama',v(d.nama)],['NIM',v(d.nim)],['Program Studi',v(d.prodi)]])+
   `<p class="ind">Untuk melaksanakan penelitian dengan judul <b>“${v(d.judul)}”</b>. Penelitian ini merupakan salah satu persyaratan akademik dalam menyelesaikan studi.</p>`+
   `<p class="ind">Besar harapan kami agar Bapak/Ibu berkenan memberikan bantuan demi kelancaran pelaksanaan penelitian tersebut.</p>`+
   `<p class="ind">Demikian surat permohonan ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.</p>`+tutup+sign(d.tgl)},

 {id:'data',title:'Pengambilan Data',desc:'Permohonan data instansi',icon:'clip',prefix:'B',
  fields:[NO,DT('tgl','Tanggal Surat:'),T('jab','Jabatan Penerima Surat:','Contoh: Kepala Badan Kesatuan Bangsa dan Politik'),
   T('kota','Tempat / Kota Tujuan:','Contoh: Kuningan'),T('wil','Wilayah Penelitian:','Contoh: wilayah Kabupaten Kuningan'),
   {k:'mhs',type:'list',l:'Daftar Mahasiswa & Tempat Penelitian',add:'+ Tambah Mahasiswa',
    item:[T('nama','Nama Mahasiswa:','Contoh: Raffa Alviansyah'),T('nim','NIM:','Contoh: 222330901023'),T('prodi','Program Studi:','Contoh: {PRODI}'),T('tempat','Tempat Penelitian:','Contoh: UPTD Puskesmas Cijandam')]}],
  render:(d,no)=>head(no,'Permohonan Data',v(d.jab),v(d.kota))+salam+
   `<p class="ind">Dalam rangka pelaksanaan proses akademik di ${facTxt()}, kami bermaksud mengajukan permohonan pengambilan data di ${v(d.wil)}.</p>`+
   `<p class="ind">Sehubungan dengan hal tersebut, kami mohon Bapak/Ibu berkenan memberikan rekomendasi untuk pelaksanaan penelitian mahasiswa kami.</p>`+
   `<p>Adapun daftar mahasiswa yang akan melakukan penelitian adalah sebagai berikut:</p>`+
   mtable(d.mhs,[['Nama','nama'],['NIM','nim'],['Program Studi','prodi'],['Tempat Penelitian','tempat']])+
   `<p class="ind">Demikian surat permohonan ini kami sampaikan. Besar harapan kami Bapak/Ibu dapat memberikan bantuan sebagaimana diperlukan.</p>`+
   `<p class="ind">Atas perhatian dan kerja sama yang baik, kami ucapkan terima kasih.</p>`+tutup+sign(d.tgl)},

 {id:'observasi',title:'Pengantar Observasi',desc:'Surat izin prasyarat tugas/matkul',icon:'eye',prefix:'P',
  fields:[NO,DT('tgl','Tanggal Surat:'),T('jab','Jabatan Penerima Surat:','Contoh: {INST} Kab. Kuningan'),
   T('tempat','Tempat / Kota Tujuan:','Contoh: Tempat atau Kuningan'),T('ta','Tahun Akademik Berjalan (Otomatis):','',{def:acadYear}),
   {k:'mhs',type:'list',l:'Daftar Mahasiswa Observasi',add:'+ Tambah Mahasiswa',item:MHS3}],
  render:(d,no)=>head(no,'Observasi',v(d.jab),v(d.tempat))+`<p>Assalamu’alaikum Wr. Wb.</p>`+
   `<p class="ind">Salam silaturahmi Kami sampaikan, semoga dalam melaksanakan aktivitas sehari-hari Bapak/Ibu senantiasa dalam lindungan Allah SWT.</p>`+
   `<p class="ind">Dalam rangka penyelesaian tugas mata kuliah Tahun Akademik ${v(d.ta)}, ${F.name} UNISA Kuningan mengajukan permohonan izin bagi mahasiswa untuk melakukan observasi di instansi yang Bapak/Ibu pimpin.</p>`+
   `<p>Berikut Kami lampirkan daftar nama mahasiswa yang akan melaksanakan observasi:</p>`+mtable(d.mhs,[['Nama','nama'],['NIM','nim'],['Program Studi','prodi']])+
   `<p class="ind">Demikian permohonan ini disampaikan, atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.</p>`+tutup+sign(d.tgl)},

 {id:'pkl',title:'Pengantar PKL / Magang',desc:'Permohonan praktik kerja lapangan',icon:'bag',prefix:'B',
  fields:[NO,DT('tgl','Tanggal Surat:'),T('jab','Jabatan Penerima Surat:','Contoh: Pimpinan PT Nusantara Teknologi'),T('tempat','Tempat / Kota Tujuan:','Contoh: Kuningan'),
   DT('mulai','Tanggal Mulai PKL:'),DT('selesai','Tanggal Selesai PKL:'),
   {k:'mhs',type:'list',l:'Daftar Peserta PKL / Magang',add:'+ Tambah Peserta',
    item:[T('nama','Nama Mahasiswa:','Contoh: Raffa Alviansyah'),T('nis','NIS:','Contoh: 22233101017'),
          {k:'lahir',l:'Tanggal Lahir:',type:'date',def:''},T('jurusan','Jurusan:','Contoh: {PRODI}')]}],
  render:(d,no)=>head(no,'Permohonan Praktik Kerja Lapangan (PKL) / Magang',v(d.jab),v(d.tempat))+salam+
   `<p class="ind">Dalam rangka pelaksanaan kurikulum ${facTxt()}, kami mengajukan permohonan agar peserta di bawah ini dapat melaksanakan Praktik Kerja Lapangan (PKL) / Magang di instansi yang Bapak/Ibu pimpin pada tanggal <b>${v(dRange(d.mulai,d.selesai))}</b>.</p>`+
   `<p>Adapun daftar peserta yang dimaksud adalah sebagai berikut:</p>`+mtable(d.mhs,[['Nama','nama'],['NIS','nis'],['Tanggal Lahir','lahir','d'],['Jurusan','jurusan']])+
   `<p class="ind">Demikian surat permohonan ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.</p>`+tutup+sign(d.tgl)},

 {id:'beasiswa',title:'Rekomendasi Beasiswa',desc:'Rekomendasi prestasi & bantuan',icon:'cap',prefix:'B',
  fields:[NO,TGL(),T('kepada','Ditujukan Kepada:','Contoh: Panitia Seleksi Beasiswa'),T('beasiswa','Nama Beasiswa:','Contoh: Beasiswa KIP Kuliah'),
   T('nama','Nama Mahasiswa:','Contoh: Raffa Alviansyah'),T('nim','NIM Mahasiswa:','Contoh: 25263091002'),T('prodi','Program Studi:','Contoh: {PRODI}'),
   T('sem','Semester:','Contoh: V (LIMA)'),T('ipk','IPK Terakhir:','Contoh: 3,65'),TA('prestasi','Prestasi / Alasan Rekomendasi:','Contoh: aktif berorganisasi dan berprestasi di bidang akademik')],
  render:(d,no)=>head(no,'Rekomendasi Beasiswa',v(d.kepada))+salam+
   `<p class="ind">Dekan ${facTxt()} dengan ini memberikan rekomendasi kepada mahasiswa berikut:</p>`+
   kv([['Nama',v(d.nama)],['NIM',v(d.nim)],['Program Studi',v(d.prodi)],['Semester',v(d.sem)],['IPK',v(d.ipk)]])+
   `<p class="ind">Untuk mengikuti seleksi <b>${v(d.beasiswa)}</b>. Yang bersangkutan merupakan mahasiswa aktif, berkelakuan baik, dan ${v(d.prestasi)}.</p>`+
   `<p class="ind">Demikian surat rekomendasi ini dibuat agar dapat dipergunakan sebagaimana mestinya.</p>`+tutup+sign(d.tgl)},

 examSvc('sempro','Permohonan Sempro','Pengajuan berkas ujian proposal','Seminar Proposal','uplus'),
 examSvc('semhas','Permohonan Semhas','Pengajuan berkas seminar hasil','Seminar Hasil','file'),
 examSvc('sidang','Permohonan Sidang Skripsi','Pendaftaran kelayakan tugas akhir','Sidang Skripsi','cap'),

 {id:'dispensasi',title:'Surat Tugas/Dispensasi Mahasiswa',desc:'Mengikuti perlombaan / delegasi resmi',icon:'users',prefix:'P',hl:true,
  fields:[NO,DT('tgl','Tanggal Surat:'),T('alasan','Alasan / Kegiatan Penting Dispensasi:','Contoh: ikut serta dalam kegiatan Pekan Olahraga'),
   T('nama','Nama Lengkap Mahasiswa:','Contoh: Risna Nurlia'),T('sem','Semester:','Contoh: I (Satu)'),T('prodi','Program Studi:','Contoh: Prodi {PRODI}'),
   DT('tglp','Tanggal Dispensasi (Mulai):'),DT('tglp2','Sampai Tanggal (kosongkan bila 1 hari):','')],
  render:(d,no)=>head(no,'Permohonan Dispensasi Mahasiswa','Bapak/Ibu Dosen Mata Kuliah')+salam+
   `<p class="ind">Salam silaturahmi senantiasa kami sampaikan, semoga Bapak/Ibu beserta seluruh keluarga, senantiasa dalam lindungan, rahmat dan maghfirah Allah SWT. Aamiin.</p>`+
   `<p class="ind">Sehubungan ada hal penting yaitu <b>${v(d.alasan)}</b>, kami mengajukan permohonan dispensasi kepada mahasiswa:</p>`+
   kv([['Nama Lengkap',b(d.nama)],['Semester',v(d.sem)],['Prodi',v(d.prodi)]])+
   `<p class="ind">Untuk dispensasi diwaktu sebagai berikut:</p>`+kv([['Hari',v(hRange(d.tglp,d.tglp2))],['Tanggal',v(dRange(d.tglp,d.tglp2))]])+
   `<p class="ind">Berkenaan dengan hal tersebut, kami mohon Bapak/Ibu Dosen Mata Kuliah dapat memberikan izin.</p>`+
   `<p class="ind">Atas perkenannya dan kerja samanya kami ucapkan terima kasih.</p>`+tutup+sign(d.tgl)}
];
const SVMAP=Object.fromEntries(SV.map(s=>[s.id,s]));

/* =====================================================================
   FITUR TAMBAHAN (v3)
   ===================================================================== */
Object.assign(IC,{
 home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
 cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 star:'<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
 chevL:'<path d="M15 18l-6-6 6-6"/>',chevR:'<path d="M9 18l6-6-6-6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
 copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
 dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
 up:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
 zoomin:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/>',
 zoomout:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6"/>',
 word:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13l1.5 5 1.5-4 1.5 4 1.5-5"/>',
 open:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>',
 share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"/>',
 help:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 4 2.8c-.7.3-1.1 1-1.1 1.7v.3M12 17h.01"/>'
});
const PAPERS={f4:{w:215,h:330,label:'F4'},a4:{w:210,h:297,label:'A4'}};
CFG.profil=Object.assign({peran:'',nama:'',nim:'',prodi:'',sem:'',ortu:'',kerja:'',nidn:'',hb:''},CFG.profil||{});
if(typeof CFG.hijriOffset!=='number')CFG.hijriOffset=0;
if(!PAPERS[CFG.paper])CFG.paper='f4';
const STEPS=['Dicetak','Diajukan','Diproses','Selesai'];
const S={svc:null,data:{},hid:null,zoom:'fit',sc:1,view:'Home',public:false};
function b64encode(str){return btoa(unescape(encodeURIComponent(str))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function b64decode(str){str=str.replace(/-/g,'+').replace(/_/g,'/');while(str.length%4)str+='=';return decodeURIComponent(escape(atob(str)))}
const ck=(p,id)=>`sipeka:${p}:${F.id}:${id}`;
const daysBetween=(a,b)=>{const p=parts(a),q=parts(b);return Math.round((Date.UTC(q[0],q[1]-1,q[2])-Date.UTC(p[0],p[1]-1,p[2]))/864e5)};
function eachDay(a,b,cb){const p=parts(a),n=Math.min(daysBetween(a,b),60);for(let i=0;i<=n;i++){const d=new Date(Date.UTC(p[0],p[1]-1,p[2]+i));cb(d.getUTCFullYear()+'-'+p2(d.getUTCMonth()+1)+'-'+p2(d.getUTCDate()))}}
function cdText(a,b){const t=todayISO();if(a<=t&&t<=b)return a===b?'Hari ini':'Berlangsung';if(b<t)return daysBetween(b,t)+' hari lalu';const n=daysBetween(t,a);return n===1?'Besok':n+' hari lagi'}
function download(blob,name){
  try{
    const u=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=u;a.download=name;a.rel='noopener';a.style.display='none';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(u),8000);
    toast('Menyimpan '+name+'. Jika tidak muncul, buka halaman ini di Chrome (bukan pratinjau Acode/editor).');
  }catch(e){
    toast('Unduhan diblokir di tampilan ini. Buka file index.html di Chrome, lalu coba lagi.');
  }
}

/*PRAYER_START*/
/* ---------- waktu sholat (perkiraan, metode Kemenag: Subuh 20°, Isya 18°) ---------- */
const KU={lat:-6.9756,lng:108.4835,tz:7};
const rad=x=>x*Math.PI/180,deg=x=>x*180/Math.PI;
const dsin=x=>Math.sin(rad(x)),dcos=x=>Math.cos(rad(x)),dtan=x=>Math.tan(rad(x));
const dasin=x=>deg(Math.asin(x)),dacos=x=>deg(Math.acos(x)),datan2=(y,x)=>deg(Math.atan2(y,x)),dacot=x=>deg(Math.atan(1/x));
const fixA=a=>a-360*Math.floor(a/360),fixH=a=>a-24*Math.floor(a/24);
function julian(y,m,d){if(m<=2){y-=1;m+=12}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5}
function sunPos(jd){const D=jd-2451545.0,g=fixA(357.529+0.98560028*D),q=fixA(280.459+0.98564736*D),L=fixA(q+1.915*dsin(g)+0.020*dsin(2*g)),e=23.439-0.00000036*D,RA=datan2(dcos(e)*dsin(L),dcos(L))/15;return{decl:dasin(dsin(e)*dsin(L)),eqt:q/15-fixH(RA)}}
function prayerFor(y,m,d){
  const jd=julian(y,m,d)-KU.lng/360;
  const mid=t=>fixH(12-sunPos(jd+t).eqt);
  const ang=(a,t,ccw)=>{const dc=sunPos(jd+t).decl,x=(-dsin(a)-dsin(dc)*dsin(KU.lat))/(dcos(dc)*dcos(KU.lat)),v=dacos(Math.max(-1,Math.min(1,x)))/15;return mid(t)+(ccw?-v:v)};
  const asr=(f,t)=>{const dc=sunPos(jd+t).decl;return ang(-dacot(f+dtan(Math.abs(KU.lat-dc))),t,false)};
  const adj=h=>h+KU.tz-KU.lng/15;
  return{subuh:adj(ang(20,5/24,true)),terbit:adj(ang(0.833,5/24,true)),dzuhur:adj(mid(12/24)),ashar:adj(asr(1,13/24)),maghrib:adj(ang(0.833,18/24,false)),isya:adj(ang(18,18/24,false))};
}
/*PRAYER_END*/
const PN=[['subuh','Subuh'],['dzuhur','Dzuhur'],['ashar','Ashar'],['maghrib','Maghrib'],['isya','Isya']];
const PR={key:'',t:null,tom:null,sig:''};
function mkDay(y,m,d){const h=prayerFor(y,m,d),base=Date.UTC(y,m-1,d),o={};
  Object.keys(h).forEach(k=>{const mins=Math.round(h[k]*60)+(k==='terbit'?-2:2);o[k]={ms:base+(mins-KU.tz*60)*60000,txt:p2(Math.floor(mins/60)%24)+'.'+p2(mins%60)}});return o}
function prayerTick(){
  const now=Date.now(),w=new Date(now+KU.tz*36e5),y=w.getUTCFullYear(),m=w.getUTCMonth()+1,d=w.getUTCDate(),key=y+'-'+m+'-'+d;
  if(PR.key!==key){PR.key=key;PR.t=mkDay(y,m,d);const t2=new Date(Date.UTC(y,m-1,d+1));PR.tom=mkDay(t2.getUTCFullYear(),t2.getUTCMonth()+1,t2.getUTCDate());PR.sig=''}
  const nx=PN.find(([k])=>PR.t[k].ms>now),ak=nx?nx[0]:'subuh',name=nx?nx[1]:'Subuh',ms=nx?PR.t[ak].ms:PR.tom.subuh.ms,sig=key+ak;
  if(PR.sig!==sig){PR.sig=sig;
    $('#prayer').innerHTML=`<div class="ph"><b>Waktu sholat · Kuningan</b><br><small>Perkiraan (metode Kemenag). Cek jadwal resmi setempat.</small></div><div class="pnext" id="pcd"></div><div class="pt">${PN.map(([k,n])=>`<div class="pi${k===ak?' nx':''}"><span>${n}</span><b>${PR.t[k].txt}</b></div>`).join('')}</div>`}
  const s=Math.max(0,Math.round((ms-now)/1000)),hh=Math.floor(s/3600),mm=Math.floor(s%3600/60),ss=s%60;
  $('#pcd').textContent=name+' dalam '+(hh?hh+' jam '+mm+' menit':mm+' menit '+ss+' detik');
}

/* ---------- jam digital ---------- */
/* ---------- kalender Hijriah (perhitungan tabular, bisa dikoreksi manual) ----------
   Kemenag menetapkan awal bulan lewat sidang isbat (hisab + rukyatul hilal), bukan
   rumus tetap, jadi hasil hitungan murni bisa selisih ±1-2 hari dari penetapan resmi,
   terutama di sekitar Ramadan/Syawal/Dzulhijjah. CFG.hijriOffset (diatur di
   Pengaturan) dipakai admin untuk menyesuaikan ke pengumuman resmi terbaru. */
const HMN=['Muharram','Safar','Rabiul Awal','Rabiul Akhir','Jumadil Awal','Jumadil Akhir','Rajab','Syaban','Ramadhan','Syawal','Dzulkaidah','Dzulhijjah'];
function gJDN(y,m,d){const a=Math.floor((14-m)/12),y2=y+4800-a,m2=m+12*a-3;
  return d+Math.floor((153*m2+2)/5)+365*y2+Math.floor(y2/4)-Math.floor(y2/100)+Math.floor(y2/400)-32045}
function jdnToHijri(jdn){
  const l0=jdn-1948440+10632,n=Math.floor((l0-1)/10631);
  let l=l0-10631*n+354;
  const j=Math.floor((10985-l)/5316)*Math.floor((50*l)/17719)+Math.floor(l/5670)*Math.floor((43*l)/15238);
  l=l-Math.floor((30-j)/15)*Math.floor((17719*j)/50)-Math.floor(j/16)*Math.floor((15238*j)/43)+29;
  const m=Math.floor((24*l)/709),d=l-Math.floor((709*m)/24),y=30*n+j-30;
  return{y,m,d};
}
function hijriText(n){
  const jdn=gJDN(n.getFullYear(),n.getMonth()+1,n.getDate())+(CFG.hijriOffset||0);
  const h=jdnToHijri(jdn);
  return h.d+' '+HMN[h.m-1]+' '+h.y+' H';
}
function tick(){
  const n=new Date(),h=n.getHours(),H=p2(h),M=p2(n.getMinutes()),s=n.getSeconds(),Sx=p2(s);
  const set=(id,val)=>{const e=$('#'+id);if(e.textContent!==val)e.textContent=val};
  set('h1',H[0]);set('h2',H[1]);set('m1',M[0]);set('m2',M[1]);set('s1',Sx[0]);set('s2',Sx[1]);
  $('#cDay').textContent=HARI[n.getDay()];
  $('#cDate').textContent=p2(n.getDate())+'-'+p2(n.getMonth()+1)+'-'+n.getFullYear();
  $('#cLong').textContent=n.getDate()+' '+BULAN[n.getMonth()]+' '+n.getFullYear();
  $('#cHijri').textContent=hijriText(n)+' · perkiraan';
  $('#greet').textContent=h<11?'Selamat pagi':h<15?'Selamat siang':h<18?'Selamat sore':'Selamat malam';
  $('#secBar').style.width=((s+1)/60*100)+'%';
  prayerTick();
}

/* ---------- state, nomor, default + profil ---------- */
const getCounter=id=>store.get(ck('counter',id),1);
function currentNo(){
  const s=S.svc,n=parseInt(S.data.no,10),num=isNaN(n)?getCounter(s.id):n,now=new Date();
  return{num,text:`${s.prefix}/${p3(num)}/${FC().kode}/UNISA/${ROMAN[now.getMonth()]}/${now.getFullYear()}`};
}
const defVal=f=>typeof f.def==='function'?f.def():(f.def||'');
function applyProfil(s,d){
  const p=CFG.profil;if(!p||!p.peran)return;
  let map={};
  if(p.peran==='dosen'){if(s.id==='tugas')map={nama:p.nama,nidn:p.nidn,hb:p.hb}}
  else if(s.id!=='tugas')map={nama:p.nama,nim:p.nim,prodi:p.prodi,sem:p.sem,ortu:p.ortu,kerja:p.kerja};
  Object.keys(map).forEach(k=>{if(map[k]&&k in d&&typeof d[k]==='string'&&!d[k])d[k]=map[k]});
  if(p.peran==='mahasiswa'&&s.id!=='pkl'&&s.id!=='tugas')s.fields.forEach(f=>{if(f.type==='list'){const it=d[f.k][0];['nama','nim','prodi'].forEach(k=>{if(p[k]&&!it[k])it[k]=p[k]})}});
}
function defaults(s){const d={};s.fields.forEach(f=>{d[f.k]=f.type==='list'?[{}]:defVal(f)});applyProfil(s,d);return d}
function sanitize(s,d){
  s.fields.forEach(f=>{
    if(f.type==='list'){
      if(!Array.isArray(d[f.k])||!d[f.k].length)d[f.k]=[{}];
      d[f.k].forEach(it=>f.item.forEach(sf=>{if(sf.type==='date'&&it[sf.k]&&!ISO.test(it[sf.k]))it[sf.k]=''}));
    }else if(f.type==='date'){if(d[f.k]&&!ISO.test(d[f.k]))d[f.k]=defVal(f)}
    else if(f.type==='time'){if(d[f.k]&&!HM.test(d[f.k]))d[f.k]=defVal(f)}
    else if(d[f.k]===undefined)d[f.k]=defVal(f);
  });
  return d;
}

/* ---------- navigasi ---------- */
function fillIcons(root){(root||document).querySelectorAll('[data-ico]').forEach(e=>{if(!e.firstChild)e.innerHTML=ico(e.dataset.ico)})}
function updBadge(){const n=store.get('sipeka:hist',[]).filter(h=>(h.st||0)<3).length,b=$('#nbHist');b.textContent=n>99?'99+':n;b.classList.toggle('hide',!n)}
function go(v){
  ['Landing','Home','Agenda','Hist','Set','Form'].forEach(n=>$('#view'+n).classList.toggle('hide',n!==v));
  S.view=v;
  document.body.classList.toggle('landing',v==='Landing');
  document.querySelectorAll('.bnav button').forEach(b=>b.classList.toggle('on',b.dataset.go===v||(v==='Form'&&b.dataset.go==='Home')));
  if(v==='Home'){renderStats();renderQuick();renderBanner();renderInfoBar()}
  if(v==='Agenda')renderAgenda();
  if(v==='Hist')renderHist();
  if(v==='Set')renderSettings();
  updBadge();window.scrollTo({top:0});
}
function exitPublic(){
  if(!S.public)return;
  S.public=false;document.body.classList.remove('pub');
  if(location.hash)history.replaceState(null,'',location.pathname+location.search);
}
const showHome=()=>{exitPublic();S.svc=null;go('Home')};
function renderInfoBar(){
  const el=$('#infoBar');if(!el)return;
  if(!CFG.jam&&!CFG.lokasi){el.innerHTML='';return}
  el.innerHTML=`<div class="card infocard"><span class="ico">${ico('cal')}</span><div><b>Jam Layanan</b><span class="mut">${esc(CFG.jam||'-')}${CFG.lokasi?' · '+esc(CFG.lokasi):''}</span></div></div>`;
}

/* ---------- tema fakultas ---------- */
function applyFac(){
  const r=document.documentElement.style;
  r.setProperty('--pri',F.pri);r.setProperty('--pri2',F.pri2);r.setProperty('--acc',F.acc);
  $('#heroFac').innerHTML=esc(F.name)+' —<br>'+univ;
  $('#heroQuote').textContent='"Urus Administrasi & Kegiatan Kampus Tanpa Ribet! Selamat datang di SIPEKA, platform satu pintu untuk mempermudah seluruh kebutuhan administrasi akademik dan pengajuan kegiatan organisasi Anda di '+F.short+' UNISA."';
  $('#brandSub').textContent=F.name;
  $('#leadFac').textContent='Layanan untuk '+F.name+'. Nomor surat memakai kode '+FC().kode+'. Ketuk bintang untuk menyimpan favorit.';
  const lg=logo(F.name.toUpperCase()+' • KUNINGAN •');
  $('#heroLogo').innerHTML=lg;$('#brandLogo').innerHTML=logo(F.name.toUpperCase()+' • KUNINGAN •');
  document.querySelectorAll('.fbtn').forEach(b=>b.setAttribute('aria-pressed',b.dataset.fac===F.id));
}
function setFac(id,quiet){
  if(!FACS[id])return;F=FACS[id];CFG.fac=id;saveCfg();applyFac();renderList();renderStats();renderQuick();
  if(!quiet)toast('Fakultas: '+F.name);
}
function renderPicker(){
  $('#pgrid').innerHTML=Object.values(FACS).map(f=>`<button class="fbtn" data-fac="${f.id}" style="--fp:${f.pri}" aria-pressed="false"><span class="mono">${f.short}</span><span class="fn">${esc(f.name)}</span></button>`).join('');
}
$('#pgrid').addEventListener('click',e=>{const b=e.target.closest('.fbtn');if(b)setFac(b.dataset.fac)});

/* ---------- beranda: daftar layanan, favorit, akses cepat, statistik ---------- */
const favs=()=>store.get('sipeka:fav',[]);
function renderList(){
  const q=($('#q').value||'').trim().toLowerCase(),fv=favs();
  const items=SV.filter(s=>!q||(s.title+' '+s.desc).toLowerCase().includes(q));
  $('#svcList').innerHTML=items.length?items.map(s=>`<div class="svc${s.hl?' hl':''}" role="button" tabindex="0" data-id="${s.id}"><span class="ico">${ico(s.icon)}</span><span class="tx"><b>${esc(s.title)}</b><span>${esc(s.desc)}</span></span><button class="star${fv.includes(s.id)?' on':''}" data-fav="${s.id}" aria-label="Favorit ${esc(s.title)}">${ico('star')}</button><svg class="go" viewBox="0 0 24 24">${IC.arrow}</svg></div>`).join(''):'<div class="empty">Layanan tidak ditemukan. Coba kata kunci lain, misalnya "penelitian" atau "dispensasi".</div>';
}
function renderQuick(){
  const fv=favs(),rec=[];
  store.get('sipeka:hist',[]).forEach(h=>{if(!rec.includes(h.svc)&&!fv.includes(h.svc))rec.push(h.svc)});
  const ids=[...fv,...rec].filter(id=>SVMAP[id]).slice(0,8);
  $('#quick').innerHTML=ids.length?`<div class="qt">Akses cepat</div><div class="qrow">${ids.map(id=>`<button class="qchip" data-id="${id}"><span class="ico">${ico(SVMAP[id].icon)}</span>${esc(SVMAP[id].title)}</button>`).join('')}</div>`:'';
}
function renderStats(){
  const h=store.get('sipeka:hist',[]).filter(x=>(x.fac||'fikes')===F.id);
  $('#stTotal').textContent=h.length;
  $('#stProses').textContent=h.filter(x=>[1,2].includes(x.st||0)).length;
  $('#stDone').textContent=h.filter(x=>(x.st||0)===3).length;
}
function openSvcFromEl(el){const id=el.dataset.id;if(id)openService(id)}
$('#svcList').addEventListener('click',e=>{
  const st=e.target.closest('.star');
  if(st){e.stopPropagation();const id=st.dataset.fav;let fv=favs();fv=fv.includes(id)?fv.filter(x=>x!==id):[...fv,id];store.set('sipeka:fav',fv);renderList();renderQuick();toast(fv.includes(id)?'Ditambahkan ke favorit':'Dihapus dari favorit');return}
  const c=e.target.closest('.svc');if(c)openSvcFromEl(c);
});
$('#svcList').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('svc')){e.preventDefault();openSvcFromEl(e.target)}});
$('#quick').addEventListener('click',e=>{const c=e.target.closest('.qchip');if(c)openSvcFromEl(c)});
$('#q').addEventListener('input',renderList);

/* ---------- agenda ---------- */
const AG={y:new Date().getFullYear(),m:new Date().getMonth(),day:null};
const manual=()=>store.get('sipeka:agenda',[]);
function evOf(h){
  const d=h.data||{},s=h.svc;let a=null,b=null;
  if(s==='tugas'||s==='dispensasi'){a=d.tglp;b=d.tglp2}
  else if(['sempro','semhas','sidang'].includes(s))a=d.tglp;
  else if(s==='pkl'){a=d.mulai;b=d.selesai}
  if(!ISO.test(a||''))return null;
  if(!ISO.test(b||'')||b<a)b=a;
  return{start:a,end:b,title:h.title,sub:h.ringkas||'',fac:h.fac||'fikes',hid:h.id};
}
function allEvents(){
  const ev=[];
  store.get('sipeka:hist',[]).forEach(h=>{const e=evOf(h);if(e)ev.push(e)});
  manual().forEach(m=>{if(ISO.test(m.start||''))ev.push({start:m.start,end:ISO.test(m.end||'')&&m.end>=m.start?m.end:m.start,title:m.title,sub:'Agenda pribadi',fac:null,mid:m.id})});
  return ev.sort((x,y)=>x.start<y.start?-1:x.start>y.start?1:0);
}
const evColor=e=>e.fac?FACS[e.fac].pri:'var(--pri)';
function renderBanner(){
  const t=todayISO(),nx=allEvents().find(e=>e.end>=t),el=$('#agBanner');
  if(!nx){el.innerHTML='';return}
  el.innerHTML=`<button class="banner" data-go="Agenda" style="--bp:${evColor(nx)}"><span class="ico">${ico('cal')}</span><span class="bt"><small>Agenda terdekat</small><b>${esc(nx.title)}${nx.sub?' · '+esc(nx.sub):''}</b><small>${esc(dHari(nx.start))}, ${esc(dRange(nx.start,nx.end))}</small></span><span class="cdchip">${cdText(nx.start,nx.end)}</span></button>`;
}
function renderAgenda(){
  const evs=allEvents(),map={},t=todayISO();
  evs.forEach(e=>eachDay(e.start,e.end,iso=>{(map[iso]=map[iso]||[]).push(e)}));
  $('#calTitle').textContent=BULAN[AG.m]+' '+AG.y;
  const first=new Date(AG.y,AG.m,1),off=(first.getDay()+6)%7,dim=new Date(AG.y,AG.m+1,0).getDate();
  let h=['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(x=>`<div class="dow">${x}</div>`).join('');
  for(let i=0;i<off;i++)h+='<div class="day out"></div>';
  for(let d=1;d<=dim;d++){
    const iso=`${AG.y}-${p2(AG.m+1)}-${p2(d)}`,list=map[iso]||[];
    h+=`<button class="day${iso===t?' today':''}${iso===AG.day?' sel':''}" data-day="${iso}"><span>${d}</span><span class="dots">${list.slice(0,3).map(e=>`<i style="--c:${evColor(e)}"></i>`).join('')}</span></button>`;
  }
  $('#cGrid').innerHTML=h;
  let list,head;
  if(AG.day){list=map[AG.day]||[];head='Agenda '+dl(AG.day)}
  else{list=evs.filter(e=>e.end>=t).slice(0,12);head='Akan datang'}
  $('#agHead').textContent=head;
  $('#agList').innerHTML=list.length?list.map(e=>{const p=parts(e.start);return `<div class="aitem" style="--c:${evColor(e)}"><div class="adate"><b>${p[2]}</b><span>${BULAN[p[1]-1].slice(0,3).toUpperCase()}</span></div><div class="at"><b>${esc(e.title)}</b><small>${esc(e.sub)}</small><small>${esc(dHari(e.start))}, ${esc(dRange(e.start,e.end))}</small></div><div class="side"><span class="cdchip">${cdText(e.start,e.end)}</span>${e.mid?`<button class="mini" data-agdel="${e.mid}">Hapus</button>`:`<button class="mini" data-agopen="${e.hid}">Buka</button>`}</div></div>`}).join(''):`<div class="empty">${AG.day?'Tidak ada agenda di tanggal ini.':'Belum ada agenda. Tanggal pelaksanaan dari surat yang kamu cetak muncul di sini otomatis. Kamu juga bisa menambah agenda pribadi.'}</div>`;
}
$('#calPrev').addEventListener('click',()=>{AG.m--;if(AG.m<0){AG.m=11;AG.y--}renderAgenda()});
$('#calNext').addEventListener('click',()=>{AG.m++;if(AG.m>11){AG.m=0;AG.y++}renderAgenda()});
$('#cGrid').addEventListener('click',e=>{const b=e.target.closest('.day[data-day]');if(!b)return;AG.day=AG.day===b.dataset.day?null:b.dataset.day;renderAgenda()});
$('#agList').addEventListener('click',e=>{
  const d=e.target.closest('[data-agdel]'),o=e.target.closest('[data-agopen]');
  if(d){store.set('sipeka:agenda',manual().filter(m=>String(m.id)!==d.dataset.agdel));renderAgenda();toast('Agenda dihapus')}
  if(o)openHistEntry(o.dataset.agopen);
});
$('#btnAgAdd').addEventListener('click',()=>{
  const d=AG.day||todayISO();
  openModal(`<h3>Tambah agenda ${xbtn}</h3><label for="ag_t">Judul kegiatan</label><input id="ag_t" placeholder="Contoh: Rapat prodi"><label for="ag_s">Tanggal mulai</label><input id="ag_s" type="date" value="${d}"><label for="ag_e">Sampai tanggal (opsional)</label><input id="ag_e" type="date"><button class="btn savebtn" data-agsave>Simpan agenda</button>`);
});

/* ---------- riwayat + pelacak status ---------- */
const HS={q:'',st:-1};
function openHistEntry(id){
  const h=store.get('sipeka:hist',[]).find(x=>String(x.id)===String(id));
  if(h){setFac(h.fac||'fikes',true);openService(h.svc,h.data,h.id)}
}
function renderHist(){
  const all=store.get('sipeka:hist',[]),q=HS.q.toLowerCase();
  const list=all.filter(h=>(HS.st<0||(h.st||0)===HS.st)&&(!q||(h.title+' '+h.nomor+' '+(h.ringkas||'')).toLowerCase().includes(q)));
  const cnt=i=>all.filter(h=>(h.st||0)===i).length;
  $('#hChips').innerHTML=`<button class="chip" data-hs="-1" aria-pressed="${HS.st<0}">Semua ${all.length}</button>`+STEPS.map((s,i)=>`<button class="chip" data-hs="${i}" aria-pressed="${HS.st===i}">${s} ${cnt(i)}</button>`).join('');
  $('#hList').innerHTML=list.length?list.map(h=>{
    const f=FACS[h.fac||'fikes'],st=h.st||0;
    return `<article class="hcard" style="--pri:${f.pri};--fp:${f.pri}"><div class="hh"><b><span class="badge">${f.short}</span>${esc(h.title)}</b><small>${esc(h.nomor)}</small><small>${esc(h.ringkas||'-')} · ${new Date(h.at).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'})}</small></div>
    <div class="steps">${STEPS.map((s,i)=>`<button class="stp${i<=st?' on':''}${i===st?' cur':''}" data-hst="${h.id}" data-i="${i}" aria-label="Status ${s}"><i></i>${s}</button>`).join('')}</div>
    <div class="btnrow"><button class="btn ghost sm" data-hopen="${h.id}"><span data-ico="open"></span>Buka</button><button class="btn line sm" data-hdup="${h.id}"><span data-ico="copy"></span>Duplikat</button><button class="btn line sm" data-hdel="${h.id}" style="color:var(--danger)"><span data-ico="trash"></span>Hapus</button></div></article>`}).join(''):`<div class="empty">${all.length?'Tidak ada surat yang cocok dengan filter.':'Belum ada surat. Riwayat muncul otomatis setelah kamu menekan tombol Download/Cetak PDF.'}</div>`;
  fillIcons($('#hList'));updBadge();
}
$('#hq').addEventListener('input',e=>{HS.q=e.target.value;renderHist()});
$('#hChips').addEventListener('click',e=>{const c=e.target.closest('[data-hs]');if(c){HS.st=+c.dataset.hs;renderHist()}});
$('#hList').addEventListener('click',async e=>{
  const g=k=>{const b=e.target.closest('['+k+']');return b?b.getAttribute(k):null};
  const hs=e.target.closest('[data-hst]');
  if(hs){const hist=store.get('sipeka:hist',[]),h=hist.find(x=>String(x.id)===hs.dataset.hst);if(h){h.st=+hs.dataset.i;store.set('sipeka:hist',hist);renderHist();toast('Status: '+STEPS[h.st])}return}
  const o=g('data-hopen');if(o){openHistEntry(o);return}
  const dp=g('data-hdup');
  if(dp){const h=store.get('sipeka:hist',[]).find(x=>String(x.id)===dp);if(h){setFac(h.fac||'fikes',true);const d=JSON.parse(JSON.stringify(h.data));d.no='';if('tgl' in d)d.tgl=todayISO();openService(h.svc,d,null);toast('Disalin sebagai surat baru')}return}
  const dl2=g('data-hdel');
  if(dl2){if(await askConfirm('Hapus surat ini dari riwayat? Tindakan ini tidak bisa dibatalkan.','Hapus')){store.set('sipeka:hist',store.get('sipeka:hist',[]).filter(x=>String(x.id)!==dl2));renderHist();toast('Surat dihapus dari riwayat')}return}
});

/* ---------- form ---------- */
const hint=i=>parts(i)?dHari(i)+', '+dl(i):'Belum dipilih';
function inputAttr(f,val,extra){
  const t=f.type==='date'?'date':f.type==='time'?'time':'text';
  return `<input type="${t}" ${extra} placeholder="${esc(ph(f.p))}" value="${esc(val||'')}">`;
}
function fieldHTML(f){
  if(f.type==='list'){
    const arr=S.data[f.k]||[{}];
    return `<div class="lbox"><div class="lt">${esc(f.l)}</div>${arr.map((it,i)=>`<div class="litem">${f.item.map((sf,j)=>{
      const last=(j===f.item.length-1&&i>0),at=`data-k="${f.k}" data-i="${i}" data-s="${sf.k}" aria-label="${esc(sf.l)}"`;
      const inp=inputAttr(sf,it[sf.k],at);
      return `<label>${esc(sf.l)}</label>`+(last?`<div class="rowdel">${inp}<button class="btn del" data-act="del" data-k="${f.k}" data-i="${i}">Hapus</button></div>`:inp);
    }).join('')}</div>`).join('')}<button class="btn add" data-act="add" data-k="${f.k}">${esc(f.add)}</button></div>`;
  }
  if(f.type==='no')return `<div class="lb"><label for="f_no">${esc(f.l)}</label></div><input id="f_no" data-k="no" inputmode="numeric" placeholder="Kosong = otomatis (${p3(getCounter(S.svc.id))}), atau isi angka" value="${esc(S.data.no||'')}">`;
  if(f.type==='area')return `<div class="lb"><label for="f_${f.k}">${esc(f.l)}</label></div><textarea id="f_${f.k}" data-k="${f.k}" placeholder="${esc(ph(f.p))}">${esc(S.data[f.k]||'')}</textarea>`;
  if(f.type==='date')return `<div class="lb"><label for="f_${f.k}">${esc(f.l)}</label><button type="button" class="mini" data-act="today" data-k="${f.k}">Hari ini</button></div>${inputAttr(f,S.data[f.k],`id="f_${f.k}" data-k="${f.k}"`)}<div class="dhint" id="h_${f.k}">${esc(hint(S.data[f.k]))}</div>`;
  return `<div class="lb"><label for="f_${f.k}">${esc(f.l)}</label></div>${inputAttr(f,S.data[f.k],`id="f_${f.k}" data-k="${f.k}"`)}`;
}
function renderForm(){
  $('#formTitle').textContent='Input Data '+S.svc.title;
  $('#formFac').textContent=F.name;
  $('#formBody').innerHTML=S.svc.fields.map(fieldHTML).join('');
}
function kop(){
  const nm=F.name.toUpperCase(),size=nm.length>32?14:nm.length>26?16:20;
  return `<div class="kop">${logo(nm+' • KUNINGAN •')}<div class="t"><div class="u1">UNIVERSITAS ISLAM AL-IHYA KUNINGAN</div><div class="u2" style="font-size:${size}pt">${esc(nm)}</div><div class="adr">Alamat: ${esc(FC().alamat)}<br>Status: ${esc(FC().status)}</div></div></div>`;
}
function renderPreview(){
  if(!S.svc)return;
  $('#paper').innerHTML=kop()+S.svc.render(S.data,currentNo().text);
  fit();
}
function fit(){
  const wrap=$('#pscale'),paper=$('#paper'),host=$('#pv');
  if(!host||!host.clientWidth)return;
  paper.style.transform='none';
  const pw=paper.offsetWidth,phh=paper.offsetHeight,fs=Math.min(1,(host.clientWidth-24)/pw),sc=S.zoom==='fit'?fs:S.zoom;
  S.sc=sc;paper.style.transform=`scale(${sc})`;
  wrap.style.height=(phh*sc)+'px';wrap.style.width=(pw*sc)+'px';wrap.style.margin='0 auto';
  $('#zpct').textContent=Math.round(sc*100)+'%';
}
window.addEventListener('resize',fit);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
$('#zIn').addEventListener('click',()=>{S.zoom=Math.min(1.6,+(S.sc+0.15).toFixed(2));fit()});
$('#zOut').addEventListener('click',()=>{S.zoom=Math.max(0.25,+(S.sc-0.15).toFixed(2));fit()});
$('#zFit').addEventListener('click',()=>{S.zoom='fit';fit()});

function applyPaper(){
  const p=PAPERS[CFG.paper],r=document.documentElement.style;
  r.setProperty('--pw',p.w+'mm');r.setProperty('--ph',p.h+'mm');
  let st=$('#pageStyle');if(!st){st=document.createElement('style');st.id='pageStyle';document.head.appendChild(st)}
  st.textContent=`@page{size:${p.w}mm ${p.h}mm;margin:0}`;
  $('#printLbl').textContent='Download/Cetak PDF Resmi ('+p.label+')';
  document.querySelectorAll('[data-paper]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.paper===CFG.paper));
  fit();
}

function openService(id,data,hid){
  const s=SVMAP[id];S.svc=s;
  S.data=sanitize(s,data?JSON.parse(JSON.stringify(data)):(store.get(ck('draft',id),null)||defaults(s)));
  S.hid=hid||null;S.zoom='fit';S.public=false;document.body.classList.remove('pub');
  go('Form');renderForm();renderPreview();
}

/* ---------- salinan surat publik (bisa dibuka siapa saja lewat link) ---------- */
function shareURL(){
  const payload={f:F.id,s:S.svc.id,n:currentNo().text,d:S.data,at:new Date().toISOString()};
  return location.origin+location.pathname+'#s='+b64encode(JSON.stringify(payload));
}
function openPublic(payload){
  const fac=FACS[payload.f],s=SVMAP[payload.s];
  if(!fac||!s)return false;
  F=fac;applyFac();
  S.svc=s;S.data=sanitize(s,payload.d||{});S.hid=null;S.zoom='fit';S.public=true;
  document.body.classList.add('pub');
  go('Form');renderForm();renderPreview();
  const when=payload.at?new Date(payload.at).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'}):'-';
  $('#pubInfo').textContent='Nomor '+(payload.n||'-')+' · dibuat '+when+'. Salinan digital untuk memudahkan pengecekan, bukan pengganti dokumen asli bertanda tangan dan cap basah.';
  return true;
}
function tryOpenFromHash(){
  const h=location.hash;
  if(!h.startsWith('#s='))return false;
  try{
    const payload=JSON.parse(b64decode(h.slice(3)));
    if(payload&&payload.f&&payload.s&&payload.d&&openPublic(payload))return true;
  }catch(e){}
  toast('Link surat tidak valid atau rusak.');
  return false;
}

let saveT;
const saveDraft=()=>{clearTimeout(saveT);saveT=setTimeout(()=>store.set(ck('draft',S.svc.id),S.data),400)};
function onField(e){
  const t=e.target;if(!t.dataset||!t.dataset.k)return;
  if(t.dataset.i!==undefined)S.data[t.dataset.k][+t.dataset.i][t.dataset.s]=t.value;
  else{S.data[t.dataset.k]=t.value;const h=$('#h_'+t.dataset.k);if(h)h.textContent=hint(t.value)}
  renderPreview();saveDraft();
}
$('#formBody').addEventListener('input',onField);
$('#formBody').addEventListener('change',onField);
$('#formBody').addEventListener('click',e=>{
  const bt=e.target.closest('[data-act]');if(!bt)return;
  const k=bt.dataset.k,a=bt.dataset.act;
  if(a==='today'){S.data[k]=todayISO();const i=$('#f_'+k);if(i)i.value=S.data[k];const h=$('#h_'+k);if(h)h.textContent=hint(S.data[k]);renderPreview();saveDraft();return}
  if(a==='add')S.data[k].push({});
  if(a==='del')S.data[k].splice(+bt.dataset.i,1);
  renderForm();renderPreview();saveDraft();
});
$('#btnClear').addEventListener('click',async()=>{
  if(!(await askConfirm('Bersihkan semua isian form ini? Nomor surat berikutnya tidak berubah.','Bersihkan')))return;
  S.data=defaults(S.svc);S.hid=null;store.del(ck('draft',S.svc.id));renderForm();renderPreview();toast('Form dibersihkan. Tanggal terisi otomatis lagi.');
});
$('#btnReset').addEventListener('click',()=>{
  store.set(ck('counter',S.svc.id),1);S.data.no='';renderForm();renderPreview();saveDraft();toast('Nomor surat direset ke 001.');
});
$('#btnHome').addEventListener('click',showHome);
$('#btnBack').addEventListener('click',showHome);
$('#brandHome').addEventListener('click',showHome);

/* ---------- cetak, Word, riwayat ---------- */
function summaryOf(){const d=S.data;return d.nama||(d.mhs&&d.mhs[0]&&d.mhs[0].nama)||d.jab||''}
function commit(){
  const s=S.svc,no=currentNo(),hist=store.get('sipeka:hist',[]);
  if(!S.hid){
    if(String(S.data.no||'').trim()===''){S.data.no=String(no.num);const inp=$('#f_no');if(inp)inp.value=S.data.no}
    S.hid=Date.now();
    hist.unshift({id:S.hid,fac:F.id,svc:s.id,title:s.title,nomor:no.text,ringkas:summaryOf(),at:new Date().toISOString(),st:0,data:JSON.parse(JSON.stringify(S.data))});
    store.set(ck('counter',s.id),no.num+1);
    renderPreview();
  }else{
    const h=hist.find(x=>x.id===S.hid);if(h){h.data=JSON.parse(JSON.stringify(S.data));h.nomor=no.text;h.ringkas=summaryOf()}
  }
  store.set('sipeka:hist',hist.slice(0,100));store.set(ck('draft',s.id),S.data);
  const inp=$('#f_no');if(inp)inp.placeholder='Kosong = otomatis ('+p3(getCounter(s.id))+'), atau isi angka';
  updBadge();
}
$('#btnPrint').addEventListener('click',()=>{
  commit();fit();
  if(typeof window.print!=='function'){toast('Cetak tidak didukung di tampilan ini. Buka halaman ini di Chrome, lalu coba lagi.');return}
  toast('Pilih "Simpan sebagai PDF" dan ukuran '+PAPERS[CFG.paper].label+'. Kalau dialog cetak tidak muncul, buka halaman ini di Chrome.');
  setTimeout(()=>{try{window.print()}catch(e){toast('Dialog cetak diblokir di tampilan ini. Buka halaman ini di Chrome, lalu coba lagi.')}},350);
});
window.addEventListener('beforeprint',()=>{const p=$('#paper');if(p)p.style.transform='none'});
window.addEventListener('afterprint',fit);
$('#btnDoc').addEventListener('click',()=>{
  commit();
  const p=PAPERS[CFG.paper],c=$('#paper').cloneNode(true);
  c.querySelectorAll('svg').forEach(x=>x.remove());
  const css=`@page{size:${p.w}mm ${p.h}mm;margin:15mm 20mm}body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.4}p{margin:0 0 8pt;text-align:justify}.ind{text-indent:1cm}table.kv{border-collapse:collapse;margin-left:1cm}table.kv.nomor{margin-left:0}td{vertical-align:top}table.grid{border-collapse:collapse;width:100%}table.grid td,table.grid th{border:1px solid #000;padding:3pt 5pt}.ttl{text-align:center;font-weight:bold;letter-spacing:4pt}.nom{text-align:center}.sign{margin-left:9cm}.kop{border-bottom:3px double #000;text-align:center;margin-bottom:10pt}.u1,.u2{font-weight:bold}`;
  const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${esc(S.svc.title)}</title><style>${css}</style></head><body>${c.innerHTML}</body></html>`;
  download(new Blob(['\ufeff',html],{type:'application/msword'}),currentNo().text.replace(/[\/\\]/g,'-')+'.doc');
});

/* ---------- WA & salin ---------- */
function waLink(t){const n=(CFG.wa||'').replace(/\D/g,'');return 'https://wa.me/'+n+'?text='+encodeURIComponent(t)}
function fmtVal(f,val){return f.type==='date'?dl(val):f.type==='time'?(val?val.replace(':','.')+' '+TZ:''):val}
function summaryText(){
  const s=S.svc,d=S.data;let t=`Halo Admin ${F.short} UNISA, saya ingin mengajukan *${s.title}*.\nNo. Surat: ${currentNo().text}\n\n`;
  s.fields.forEach(f=>{
    if(f.type==='no')return;
    if(f.type==='list'){(d[f.k]||[]).forEach((it,i)=>{t+=`${f.l} #${i+1}\n`;f.item.forEach(sf=>{const x=fmtVal(sf,it[sf.k]);if(x)t+=`- ${sf.l.replace(/:$/,'')}: ${x}\n`})});return}
    const x=fmtVal(f,d[f.k]);if(x)t+=`${f.l.replace(/:$/,'')}: ${x}\n`;
  });
  return t.trim();
}
function openLink(url){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()}
$('#btnWA').addEventListener('click',()=>openLink(waLink(summaryText())));
$('#btnCopy').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(summaryText());toast('Ringkasan data disalin.')}
  catch(e){toast('Gagal menyalin. Izinkan akses clipboard di browser.')}
});
$('#btnShare').addEventListener('click',()=>{
  commit();
  const link=shareURL();
  openModal(`<h3>Bagikan surat ${xbtn}</h3><p class="mut">Siapa pun yang membuka link ini bisa melihat dan mengunduh salinan digital surat ini, tanpa perlu membuka SIPEKA secara penuh.</p><label for="shLink">Link surat</label><input id="shLink" readonly value="${esc(link)}"><div class="btnrow"><button class="btn ghost sm" data-shcopy>Salin link</button><button class="btn line sm" data-shwa>Kirim via WA</button><button class="btn line sm" data-shopen>Buka pratinjau</button></div>`);
});
const updateFab=()=>{$('#fab').href=waLink('Halo Admin '+F.short+' UNISA, saya butuh bantuan terkait SIPEKA.')};

/* ---------- modal ---------- */
const xbtn=`<button class="ibtn" data-close aria-label="Tutup"><span class="ico">${ico('x')}</span></button>`;
function openModal(html){$('#sheet').innerHTML=html;$('#modal').classList.add('on')}
let confirmResolve=null;
function closeModal(){$('#modal').classList.remove('on');if(confirmResolve){const r=confirmResolve;confirmResolve=null;r(false)}}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'||e.target.closest('[data-close]'))closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
/* Dialog konfirmasi buatan sendiri: dipakai untuk hapus/bersihkan supaya tidak
   bergantung pada confirm() bawaan browser, yang sering diblokir di WebView
   seperti pratinjau Acode/editor. */
function askConfirm(msg,okLabel){
  return new Promise(res=>{
    confirmResolve=res;
    openModal(`<h3>Konfirmasi${xbtn}</h3><p class="mut" style="margin:0 0 16px">${esc(msg)}</p><div class="btnrow"><button class="btn line sm" data-cf="0" style="flex:1">Batal</button><button class="btn del sm" data-cf="1" style="flex:1">${esc(okLabel||'Ya, lanjutkan')}</button></div>`);
  });
}
$('#sheet').addEventListener('click',e=>{
  const cf=e.target.closest('[data-cf]');
  if(cf){const r=confirmResolve;confirmResolve=null;$('#modal').classList.remove('on');if(r)r(cf.dataset.cf==='1')}
});
$('#sheet').addEventListener('click',e=>{
  if(e.target.closest('[data-agsave]')){
    const t=$('#ag_t').value.trim(),s=$('#ag_s').value,en=$('#ag_e').value;
    if(!t||!ISO.test(s)){toast('Isi judul dan tanggal mulai.');return}
    store.set('sipeka:agenda',[...manual(),{id:Date.now(),title:t,start:s,end:en}]);closeModal();renderAgenda();toast('Agenda disimpan');
  }
  if(e.target.closest('[data-restore]'))restoreFrom($('#rs_t').value);
  if(e.target.closest('[data-shcopy]')){navigator.clipboard.writeText($('#shLink').value).then(()=>toast('Link disalin.')).catch(()=>toast('Gagal menyalin. Salin manual dari kotak teksnya.'))}
  if(e.target.closest('[data-shwa]'))openLink(waLink('Berikut link salinan digital surat dari SIPEKA:\n'+$('#shLink').value));
  if(e.target.closest('[data-shopen]'))openLink($('#shLink').value);
});

/* ---------- cadangan data ---------- */
function backupObj(){const o={};try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('sipeka:'))o[k]=localStorage.getItem(k)}}catch(e){}return{app:'sipeka',v:3,at:new Date().toISOString(),data:o}}
function restoreFrom(text){
  try{
    const j=JSON.parse(text);if(j.app!=='sipeka'||!j.data)throw 0;
    Object.keys(j.data).forEach(k=>{if(k.startsWith('sipeka:'))localStorage.setItem(k,j.data[k])});
    toast('Cadangan dipulihkan. Memuat ulang…');setTimeout(()=>location.reload(),900);
  }catch(e){toast('Data cadangan tidak valid.')}
}
$('#fileImp').addEventListener('change',e=>{const f=e.target.files[0];if(f)f.text().then(restoreFrom);e.target.value=''});

/* ---------- pengaturan ---------- */
function setThemeMode(m){
  if(m==='auto'){store.del('sipeka:theme');delete document.documentElement.dataset.theme}
  else{store.set('sipeka:theme',m);document.documentElement.dataset.theme=m}
  paintTheme();
}
const isDark=()=>{const t=document.documentElement.dataset.theme;return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches};
const paintTheme=()=>{$('#icoTheme').innerHTML=ico(isDark()?'sun':'moon')};
$('#btnTheme').addEventListener('click',()=>{setThemeMode(isDark()?'light':'dark');if(S.view==='Set')renderSettings()});
const seg=(attr,opts,cur)=>`<div class="seg">${opts.map(o=>`<button type="button" ${attr}="${o[0]}" aria-pressed="${cur===o[0]}">${o[1]}</button>`).join('')}</div>`;
const fld=(k,l,val,sc,p)=>`<label for="s_${sc}_${k}">${l}</label><input id="s_${sc}_${k}" data-cfg="${k}" data-scope="${sc}" value="${esc(val)}" placeholder="${esc(p||'')}">`;
function renderSettings(){
  const c=FC(),p=CFG.profil,tm=store.get('sipeka:theme','auto');
  let prof='';
  if(p.peran==='mahasiswa')prof=fld('nama','Nama lengkap',p.nama,'profil','Contoh: Raffa Alviansyah')+fld('nim','NIM',p.nim,'profil','Contoh: 25263091002')+fld('prodi','Program studi',p.prodi,'profil','Contoh: '+F.prodi)+fld('sem','Semester',p.sem,'profil','Contoh: II (DUA)')+fld('ortu','Nama orang tua',p.ortu,'profil','')+fld('kerja','Pekerjaan orang tua',p.kerja,'profil','');
  if(p.peran==='dosen')prof=fld('nama','Nama & gelar',p.nama,'profil','Contoh: Raffa Alviansyah, S.Kom')+fld('nidn','NIDN',p.nidn,'profil','Contoh: 123456')+fld('hb','Home base',p.hb,'profil','Contoh: '+F.prodi);
  $('#setBody').innerHTML=`
  <div class="card"><h3>Profil (isi form otomatis)</h3><p class="mut">Data ini mengisi form baru secara otomatis. Kamu tetap bisa mengubahnya di form.</p>
    ${seg('data-peran',[['','Tidak dipakai'],['mahasiswa','Mahasiswa'],['dosen','Dosen']],p.peran)}${prof}</div>
  <div class="card"><h3>Surat & kop fakultas</h3><p class="mut">Pilih fakultas yang mau diatur. Dekan, kode nomor, dan alamat kop dipisah per fakultas.</p>
    <div class="seg">${Object.values(FACS).map(f=>`<button type="button" data-sfac="${f.id}" aria-pressed="${f.id===F.id}">${f.short}</button>`).join('')}</div>
    ${fld('dekan','Nama Dekan (tanda tangan)',c.dekan,'fac','Contoh: Dr. Nama, M.Pd')}${fld('nidn','NIDN Dekan',c.nidn,'fac','Contoh: 0412345678')}${fld('kode','Kode fakultas pada nomor surat',c.kode,'fac','Contoh: '+F.kode)}${fld('alamat','Alamat pada kop',c.alamat,'fac','Contoh: Kampus 1 Jl. …')}${fld('status','Status akreditasi pada kop',c.status,'fac','Contoh: Terakreditasi')}
    ${fld('kota','Kota titimangsa (semua fakultas)',CFG.kota,'glob','Contoh: Kuningan')}${fld('wa','Nomor WhatsApp Admin (format 628…)',CFG.wa,'glob','Contoh: 6281234567890')}${fld('jam','Jam layanan (tampil di beranda)',CFG.jam,'glob','Contoh: Senin-Jumat, 08.00-15.00 WIB')}${fld('lokasi','Lokasi/ruang layanan',CFG.lokasi,'glob','Contoh: Kantor TU FIKES')}</div>
  <div class="card"><h3>Cetak & tampilan</h3>
    <label>Ukuran kertas</label>${seg('data-paper',[['f4','F4 (215 × 330 mm)'],['a4','A4 (210 × 297 mm)']],CFG.paper)}
    <label>Tema</label>${seg('data-tmode',[['auto','Otomatis'],['light','Terang'],['dark','Gelap']],tm)}</div>
  <div class="card"><h3>Kalender Hijriah</h3><p class="mut">Kemenag menetapkan awal bulan lewat sidang isbat (hisab + rukyatul hilal), jadi hasil hitungan otomatis bisa selisih 1-2 hari dari pengumuman resmi, terutama menjelang Ramadan, Syawal, dan Dzulhijjah. Geser koreksi ini kalau perlu.</p>
    <label>Tanggal saat ini: <b id="hijPrev">${esc(hijriText(new Date()))}</b></label>
    <div class="seg" style="grid-template-columns:auto 1fr auto"><button type="button" data-hoff="-1">− 1 hari</button><button type="button" data-hoff="0">Koreksi: ${CFG.hijriOffset>0?'+':''}${CFG.hijriOffset} hari</button><button type="button" data-hoff="1">+ 1 hari</button></div></div>
  <div class="card"><h3>Data & cadangan</h3><p class="mut">Data tersimpan di browser perangkat ini. Buat cadangan supaya bisa dipindah ke HP atau laptop lain.</p>
    <div class="btnrow"><button class="btn ghost sm" data-b="exp"><span data-ico="dl"></span>Unduh cadangan</button><button class="btn ghost sm" data-b="copy"><span data-ico="copy"></span>Salin cadangan</button><button class="btn line sm" data-b="file"><span data-ico="up"></span>Pulihkan dari file</button><button class="btn line sm" data-b="text">Pulihkan dari teks</button></div>
    <div class="btnrow"><button class="btn line sm" data-b="wipe" style="color:var(--danger)"><span data-ico="trash"></span>Hapus semua data</button></div></div>
  <div class="card"><h3>Tentang SIPEKA</h3><p class="mut" style="margin:0">Sistem Informasi Pengajuan Kegiatan &amp; Akademik, ${univ}.<br>Waktu sholat dihitung otomatis untuk Kuningan dan bersifat perkiraan. Tanggal Hijriah dihitung otomatis dan bisa dikoreksi manual di atas supaya cocok dengan pengumuman resmi Kemenag.<br>© 2026 Created by Raffa Alviansyah | Software Engineer.</p></div>`;
  fillIcons($('#setBody'));
}
let cfgT;
$('#setBody').addEventListener('input',e=>{
  const t=e.target,k=t.dataset.cfg;if(!k)return;
  const v0=t.value.trim(),sc=t.dataset.scope;
  if(sc==='fac')FC()[k]=k==='nidn'?v0:(v0||defFac(F)[k]);
  else if(sc==='glob')CFG[k]=k==='kota'?(v0||'Kuningan'):v0;
  else CFG.profil[k]=v0;
  clearTimeout(cfgT);cfgT=setTimeout(()=>{saveCfg();updateFab();applyFac();renderInfoBar();toast('Tersimpan')},500);
});
$('#setBody').addEventListener('click',async e=>{
  const q=a=>e.target.closest('['+a+']');
  let b;
  if(b=q('data-sfac')){setFac(b.dataset.sfac,true);renderSettings();return}
  if(b=q('data-peran')){CFG.profil.peran=b.dataset.peran;saveCfg();renderSettings();return}
  if(b=q('data-tmode')){setThemeMode(b.dataset.tmode);renderSettings();return}
  if(b=q('data-hoff')){
    const v=+b.dataset.hoff;
    CFG.hijriOffset=v===0?0:Math.max(-3,Math.min(3,(CFG.hijriOffset||0)+v));
    saveCfg();renderSettings();toast('Koreksi Hijriah: '+(CFG.hijriOffset>0?'+':'')+CFG.hijriOffset+' hari');return;
  }
  if(b=q('data-b')){
    const a=b.dataset.b;
    if(a==='exp')download(new Blob([JSON.stringify(backupObj())],{type:'application/json'}),'sipeka-cadangan-'+todayISO()+'.json');
    if(a==='copy')navigator.clipboard.writeText(JSON.stringify(backupObj())).then(()=>toast('Teks cadangan disalin. Tempel di catatan untuk disimpan.')).catch(()=>toast('Gagal menyalin. Coba buka halaman ini di Chrome.'));
    if(a==='file')$('#fileImp').click();
    if(a==='text')openModal(`<h3>Pulihkan dari teks ${xbtn}</h3><label for="rs_t">Tempel teks cadangan di sini</label><textarea id="rs_t" placeholder='{"app":"sipeka",...}'></textarea><button class="btn savebtn" data-restore>Pulihkan</button>`);
    if(a==='wipe'){
      if(await askConfirm('Hapus SEMUA data SIPEKA di perangkat ini (riwayat, agenda, draf, pengaturan)? Tindakan ini tidak bisa dibatalkan.','Hapus semua')){
        try{Object.keys(localStorage).filter(k=>k.startsWith('sipeka:')).forEach(k=>localStorage.removeItem(k))}catch(err){}
        toast('Semua data dihapus. Memuat ulang…');setTimeout(()=>location.reload(),900);
      }
    }
  }
});

/* ---------- navigasi global ---------- */
document.addEventListener('click',e=>{
  const pp=e.target.closest('[data-paper]');
  if(pp){CFG.paper=pp.dataset.paper;saveCfg();applyPaper();return}
  const g=e.target.closest('[data-go]');
  if(g){if(g.dataset.go==='Home')S.svc=null;go(g.dataset.go)}
});

/* ---------- init ---------- */
$('#btnHelp').addEventListener('click',()=>{
  openModal(`<h3>Bantuan ${xbtn}</h3>
   <h4>Alur pengajuan surat</h4><p class="mut">Pilih fakultas di beranda → pilih jenis layanan surat → isi data di form → cek pratinjau surat → ketuk Download/Cetak PDF. Surat otomatis tersimpan di halaman Riwayat pada perangkat ini.</p>
   <h4>Status surat</h4><p class="mut"><b>Dicetak</b>: surat baru dibuat. <b>Diajukan</b>: sudah diserahkan ke pihak terkait. <b>Diproses</b>: sedang ditindaklanjuti. <b>Selesai</b>: sudah tuntas. Ubah status dengan mengetuk langkahnya di halaman Riwayat.</p>
   <h4>Agenda</h4><p class="mut">Tanggal pelaksanaan dari surat yang dicetak (tugas, sidang, dispensasi, PKL, dan lainnya) otomatis masuk ke halaman Agenda, lengkap dengan hitung mundur.</p>
   <h4>Bagikan ke orang lain</h4><p class="mut">Di halaman input surat, ketuk "Bagikan link surat" untuk memberi siapa pun (dosen, instansi tujuan) link yang langsung menampilkan salinan digital surat itu, tanpa perlu membuka SIPEKA secara penuh.</p>
   <h4>Butuh bantuan lain?</h4><p class="mut" style="margin:0">Hubungi admin lewat tombol Chat Admin di pojok kanan bawah.</p>`);
});
$('#pubExit').addEventListener('click',showHome);
document.querySelectorAll('[data-enter-app]').forEach(b=>b.addEventListener('click',()=>go('Home')));
$('#landLogo').innerHTML=logo('UNIVERSITAS ISLAM AL-IHYA KUNINGAN • UNISA •');
$('#landFacRow').innerHTML=Object.values(FACS).map(f=>`<div class="lfacchip" style="--fp:${f.pri}"><i></i>${esc(f.short)} — ${esc(f.name)}</div>`).join('');
{const t=store.get('sipeka:theme',null);if(t)document.documentElement.dataset.theme=t}
fillIcons();
renderPicker();F=FACS[CFG.fac];applyFac();applyPaper();paintTheme();renderList();renderStats();renderQuick();renderBanner();renderInfoBar();updateFab();updBadge();
$('#cTz').textContent=TZ;
tick();setInterval(tick,1000);
go('Landing');
tryOpenFromHash();
