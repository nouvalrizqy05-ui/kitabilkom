const fs = require('fs');

const createBanner = (subtitle, title) => `      <section className="page-header-buku">
        <BackButton />
        <div className="banner-buku-pattern top">
          <div className="banner-buku-logos-top">
            <img src="/assets/Group 100881 (2).png" alt="Logos" />
          </div>
        </div>
        <div className="banner-buku-body">
          <div className="banner-buku-left-ornament">
             <div className="banner-buku-kitab-ilkom">
                <span>KITAB</span>
                <span>ILKOM</span>
             </div>
             <div className="banner-buku-vline"></div>
          </div>
          <div className="banner-buku-center-text">
            <span className="banner-buku-subtitle">${subtitle}</span>
            <h1 className="banner-buku-title">${title}</h1>
          </div>
          <div className="banner-buku-speech-bubble">IPK 4 menanti!<br/>Semangat :)</div>
          <img src="/assets/lebah akasin.png" alt="Lebah Akasin" className="banner-buku-mascot-right" />
        </div>
        <div className="banner-buku-pattern bottom"></div>
      </section>`;

const updateFile = (path, subtitle, title) => {
    let jsx = fs.readFileSync(path, 'utf8');
    
    // Find the old page-header section and replace it
    // The section starts with <section className="page-header"> and ends with </section>
    // before <section className="page-content">
    
    const regex = /<section className="page-header">[\s\S]*?<\/section>/;
    jsx = jsx.replace(regex, createBanner(subtitle, title));
    
    fs.writeFileSync(path, jsx, 'utf8');
    console.log('Updated ' + path);
};

updateFile('src/pages/InfoAkademik.jsx', 'PENGUMUMAN', 'INFO AKADEMIK');
updateFile('src/pages/DosenIlkom.jsx', 'DIREKTORI', 'DOSEN ILKOM');
updateFile('src/pages/Publikasi.jsx', 'DATABASE', 'PUBLIKASI ILMIAH');

