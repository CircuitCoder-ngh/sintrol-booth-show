/* Sintrol booth showcase: content.
   Every fact here comes from sintrol.fi/international (pages, product pages, reference cases),
   the product brochures and the certificates linked from it, as of November 2026.
   Edit freely: the show reads everything from this file (plus network.js and articles.js). */

window.SINTROL = (function () {
  "use strict";

  /* ---------- Event ----------
     Shown top right. Leave name empty to show the Sintrol tagline instead.
     Example: { name: "CEM Asia 2026", place: "Kuala Lumpur, Malaysia", dates: "17 to 19 November 2026", booth: "Booth 4" } */
  const event = { name: "", place: "", dates: "", booth: "" };

  /* ---------- Company ---------- */
  const company = {
    name: "Sintrol Oy",
    tagline: "Measuring Matters",
    address: "Ruosilantie 15, 00390 Helsinki, Finland",
    web: "sintrol.fi/international",
    url: "https://sintrol.fi/international/",
    email: "info@sintrol.com",
    orders: "insa@sintrol.com",
    phone: "+358 9 5617 360",
    facts: [
      { big: "1975", small: "Founded in Helsinki, Finland" },
      { big: "1993", small: "Sintrol starts making its own dust monitors" },
      { big: "20,000+", small: "dust monitor installations" },
      { big: "50+", small: "countries with Sintrol monitors" }
    ],
    more: [
      ["Ownership", "Family-owned Finnish company"],
      ["People", "About 50 employees worldwide"],
      ["Head office", "Helsinki, Finland"],
      ["Sales offices", "New Delhi, India and Beijing, China"],
      ["Quality", "ISO 9001:2015 certified (Kiwa)"],
      ["R&D", "Every product designed by Sintrol's own in-house R&D team"],
      ["Distributors", "Local partners in 40 countries"],
      ["Climate", "\"Carbon Footprint Calculated\" label, Finland Chamber of Commerce, 2026"]
    ],
    timeline: [
      ["1975", "Mauri Sinervä founds Sintrol in Helsinki. Early growth comes from representing Brooks Instrument, alongside Honeywell and Fischer & Porter."],
      ["1993", "Sintrol starts manufacturing its own dust monitors, the products that earn it global recognition."],
      ["2015", "DUMO and DUMO RF ambient monitors are certified for potentially explosive gas and dust atmospheres."],
      ["2021", "Launch of the S305QAL, the QAL1-certified CEMS dust monitor, and the second-generation DumoPro."],
      ["2024", "The S304QAL-L filter leakage monitor and S304QAL-D filter dust monitor join the range."],
      ["2025", "50 years of industrial measurement. S304QAL certified to EN 15859; S305QAL MCERTS renewed and NPL India certified."],
      ["2026", "Samuli Pahkala becomes CEO. New S314 split-architecture monitor, EXO QAL wet-gas monitor and DustCloud service. Carbon Footprint Calculated label."]
    ],
    values: [
      ["Skilled staff", "We value and support our staff, who are the foundation of our operations and the key to our success."],
      ["Team spirit", "We encourage, help and respect others, and we work together with enthusiasm and commitment."],
      ["Customer centricity", "We care for the success and well-being of our customers."],
      ["Continuous improvement", "We find ways to develop our skills and solutions, being active and innovative towards a better future."]
    ],
    mission: "We provide solutions to our customers' productivity, safety and environmental challenges with measurement and analysis technologies.",
    vision: "Sintrol is a leading and profitably growing provider of measurement and analysis-based Cleantech solutions and services for the industrial sector.",
    why: [
      "QAL1-certified and Ex-certified instruments available",
      "Low cost of ownership: no consumables",
      "No moving parts in the measurement, so reliable and durable",
      "One-sided installation with no alignment",
      "Not affected by vibration or temperature",
      "Local display with status indication"
    ]
  };

  /* International sales and support contacts, as listed on sintrol.fi/international */
  const team = [
    { name: "John Korpi", role: "International Sales Director, Dust Monitoring Solutions", phone: "+358 50 463 5452", email: "john.korpi@sintrol.com" },
    { name: "Juha-Matti Uski", role: "Chief Technical Officer", phone: "+358 40 419 7037", email: "juha-matti.uski@sintrol.com" },
    { name: "Eero Laine", role: "Product and Application Manager, Dust Monitoring Solutions", phone: "+358 9 5617 3637", email: "eero.laine@sintrol.com" },
    { name: "Vikram Singh", role: "Country Manager, India and Middle East", phone: "+91 98116 76061", email: "vikram.singh@sintrol.com" },
    { name: "Zhou Gao", role: "Sales Manager, China", phone: "+86 139 1137 4609", email: "zhou.gao@sintrol.com" }
  ];

  /* ---------- Documents ----------
     file: PDF in /docs (works offline). Thumbnails live in assets/thumbs with the same name. */
  const D = {};
  function doc(id, title, group, file, note) {
    D[id] = { id, title, group, note: note || "", file: "docs/" + file, thumb: "assets/thumbs/" + file.replace(/\.pdf$/i, ".jpg") };
  }
  doc("company", "Sintrol dust monitoring solutions", "Company", "Sintrol_Dust_Monitoring_Solutions.pdf", "Company and product overview");
  doc("iso", "ISO 9001 certificate", "Company", "Sintrol_ISO_9001_Certificate.pdf", "Kiwa, certificate 5236-08");
  // Brochures
  doc("b-s305qal", "S305QAL brochure", "Brochures", "S305QAL_Brochure.pdf");
  doc("b-s304", "S303 and S304 brochure", "Brochures", "S303_S304_Brochure.pdf");
  doc("b-s201", "S201 and S203 brochure", "Brochures", "S201_S203_Brochure.pdf");
  doc("b-s101", "S101 and S103 brochure", "Brochures", "S101_S103_Brochure.pdf");
  doc("b-s304qal", "S304QAL-D/L brochure", "Brochures", "S304QAL-D_L_Brochure.pdf");
  doc("b-s314", "S314 and S314 Ex brochure", "Brochures", "S314_Brochure.pdf");
  doc("b-espy", "E-Spy brochure", "Brochures", "E-Spy_Brochure.pdf");
  doc("b-dumopro", "DumoPro and DumoPro Ex brochure", "Brochures", "DumoPro_Brochure.pdf");
  doc("b-exoqal", "EXO QAL brochure", "Brochures", "EXO_QAL_Brochure.pdf");
  doc("b-exo", "EXO brochure", "Brochures", "EXO_Brochure.pdf");
  doc("b-dustcloud", "DustCloud brochure", "Brochures", "DustCloud_Brochure.pdf");
  doc("b-vulcan", "Vulcan furnace camera brochure", "Brochures", "Vulcan_Furnace_Cameras_Brochure.pdf");
  // Manuals
  doc("m-s305qal", "S305QAL user manual", "User manuals", "S305QAL_User_Manual.pdf", "113 pages");
  doc("m-s304", "S303 and S304 user manual", "User manuals", "S303_S304_User_Manual.pdf", "118 pages");
  doc("m-s201", "S201 and S203 user manual", "User manuals", "S201_S203_User_Manual.pdf", "86 pages");
  doc("m-s101", "S101 user manual", "User manuals", "S101_User_Manual.pdf", "80 pages");
  doc("m-s103", "S103 user manual", "User manuals", "S103_User_Manual.pdf", "80 pages");
  doc("m-s304qal", "S304QAL-D/L user manual", "User manuals", "S304QAL-D_L_User_Manual.pdf", "102 pages");
  doc("m-espy", "E-Spy user manual", "User manuals", "E-Spy_User_Manual.pdf", "22 pages");
  doc("m-dumopro", "DumoPro user manual", "User manuals", "DumoPro_User_Manual.pdf", "100 pages");
  doc("m-exo", "EXO user manual", "User manuals", "EXO_User_Manual.pdf", "148 pages, 14 MB");
  doc("m-dusttool", "DustTool 2 user manual", "User manuals", "DustTool2_User_Manual.pdf", "26 pages");
  doc("x-s100", "S100 Ex supplement to the manual", "User manuals", "S100_Ex_Manual_Supplement.pdf", "ATEX");
  doc("x-s201", "S201/S203 Ex supplement to the manual", "User manuals", "S201_S203_Ex_Manual_Supplement.pdf", "NA HazLoc and ATEX");
  doc("x-s304", "S303/S304 Ex supplement to the manual", "User manuals", "S303_S304_Ex_Manual_Supplement.pdf", "NA HazLoc and ATEX");
  doc("x-dumopro", "DumoPro Ex supplement to the manual", "User manuals", "DumoPro_Ex_Manual_Supplement.pdf", "NA HazLoc and ATEX");
  // Certificates and approvals
  doc("c-s305qal-qal1", "S305QAL QAL1 product conformity certificate", "Certificates", "S305QAL_QAL1_Certificate_TUV.pdf", "TÜV SÜD, EN 15267-3");
  doc("c-s305qal-probe", "S305QAL QAL1 announcement: longer probe", "Certificates", "S305QAL_QAL1_Longer_Probe_Announcement.pdf", "TÜV SÜD, 2025");
  doc("c-s305qal-mcerts", "S305QAL MCERTS certificate", "Certificates", "S305QAL_MCERTS_Certificate.pdf", "CSA Group, UK");
  doc("c-s305qal-npl", "S305QAL NPL India certificate", "Certificates", "S305QAL_NPL_India_Certificate.pdf", "National Physical Laboratory, India");
  doc("c-s304qal-d", "S304QAL-D QAL1 certificate", "Certificates", "S304QAL-D_QAL1_Certificate_TUV.pdf", "TÜV SÜD, EN 15859");
  doc("c-s304qal-l", "S304QAL-L QAL1 certificate", "Certificates", "S304QAL-L_QAL1_Certificate_TUV.pdf", "TÜV SÜD, EN 15859");
  doc("c-atex-s300", "ATEX certificate, S200 and S300 series", "Certificates", "S200_S300_ATEX_Certificate.pdf", "ExVeritas 21ATEX1104X");
  doc("c-iecex-s300", "IECEx certificate, S200 and S300 series", "Certificates", "S200_S300_IECEx_Certificate.pdf", "IECEx EXV 21.0083X");
  doc("c-atex-s100", "ATEX certificate, S101 and S103 Ex", "Certificates", "S101_S103_ATEX_Certificate.pdf", "EESF 22 ATEX 033X");
  doc("c-iecex-s100", "IECEx certificate, S101 and S103 Ex", "Certificates", "S101_S103_IECEx_Certificate.pdf");
  doc("c-atex-dumopro", "ATEX certificate, DumoPro Ex", "Certificates", "DumoPro_ATEX_Certificate.pdf", "ExVeritas 21ATEX1109X");
  doc("c-iecex-dumopro", "IECEx certificate, DumoPro Ex", "Certificates", "DumoPro_IECEx_Certificate.pdf", "IECEx EXV 21.0087X");
  doc("c-hazloc", "HazLoc approval letter (US and Canada)", "Certificates", "HazLoc_MET_Approval_Letter.pdf", "MET Laboratories");
  doc("c-kcs-s300", "Korean KCs certificate, S200 and S300 series", "Certificates", "S200_S300_Korean_KCs_Certificate.pdf");
  doc("c-kcs-dumopro", "Korean KCs certificate, DumoPro Ex", "Certificates", "DumoPro_Korean_KCs_Certificate.pdf");
  // EU declarations of conformity
  doc("doc-s305qal", "EU declaration of conformity, S305QAL", "Declarations", "DoC_S305QAL.pdf", "CE and RoHS 3");
  doc("doc-s300", "EU declaration of conformity, S201, S203, S303, S304", "Declarations", "DoC_S201_S203_S303_S304.pdf", "CE and RoHS 3");
  doc("doc-s300ex", "EU declaration of conformity, S201, S203, S303, S304 Ex", "Declarations", "DoC_S201_S203_S303_S304_Ex.pdf", "CE and RoHS 3");
  doc("doc-s304qal", "EU declaration of conformity, S304QAL Ex", "Declarations", "DoC_S304QAL_Ex.pdf", "CE and RoHS 3");
  doc("doc-s100", "EU declaration of conformity, S100", "Declarations", "DoC_S100.pdf", "CE and RoHS 3");
  doc("doc-s100ex", "EU declaration of conformity, S100 Ex", "Declarations", "DoC_S100_Ex.pdf", "CE and RoHS 3");
  doc("doc-dumopro", "EU declaration of conformity, DumoPro", "Declarations", "DoC_DumoPro.pdf", "CE and RoHS 3");
  doc("doc-dumoproex", "EU declaration of conformity, DumoPro Ex", "Declarations", "DoC_DumoPro_Ex.pdf", "CE and RoHS 3");
  // Application notes (one per reference case)
  doc("an-wood", "Bag filter management in wood processing", "Application notes", "AppNote_Wood_Processing_Bag_Filters.pdf");
  doc("an-sugar", "Ambient dust monitoring in sugar silos", "Application notes", "AppNote_Sugar_Silos_and_Conveying.pdf");
  doc("an-rcc", "Dust measurement in reinforced concrete stacks", "Application notes", "AppNote_Reinforced_Concrete_Stacks.pdf");
  doc("an-steel", "Dust monitoring across steel manufacturing", "Application notes", "AppNote_Steel_Manufacturing.pdf");
  doc("an-cement", "Dust monitoring in cement manufacturing", "Application notes", "AppNote_Cement_Manufacturing.pdf");
  doc("an-flour", "Filter leak detection in flour milling", "Application notes", "AppNote_Flour_Milling.pdf");
  doc("an-power", "Post-ESP dust monitoring in a coal-fired power plant", "Application notes", "AppNote_Post-ESP_Coal_Power_Plant.pdf");
  doc("an-metal", "Workplace dust monitoring in metallurgical workshops", "Application notes", "AppNote_Metallurgical_Workshops.pdf");

  /* ---------- Families: the chapters on the rail ----------
     name: rail label. open: what a tap on the rail label opens (an Explore tab, or a Learn more deep dive). */
  const families = [
    { id: "tech", name: "Technology", title: "Inductive Electrification", blurb: "One probe, no optics, no consumables: how Sintrol monitors turn charged particles into a dust reading.", open: { deep: "principle" } },
    { id: "emission", name: "Emissions", title: "Emission monitoring", blurb: "Certified particulate monitoring for dry, wet and condensing stacks.", open: { tab: "products" } },
    { id: "filtration", name: "Filtration", title: "Filtration and process monitoring", blurb: "Broken-bag detection, filter leakage and process trend monitors for every duct size.", open: { tab: "products" } },
    { id: "ambient", name: "Workplace", title: "Workplace and ambient dust", blurb: "Real-time airborne dust detection around the process, including hazardous areas.", open: { tab: "products" } },
    { id: "software", name: "Software", title: "Dust monitoring software", blurb: "Configure every monitor with DustTool; see every site at once with DustCloud.", open: { tab: "products" } },
    { id: "apps", name: "Applications", title: "Applications", blurb: "Nine ways plants use Sintrol dust monitors, from stack compliance to blockage alarms.", open: { tab: "apps" } },
    { id: "cases", name: "References", title: "Reference cases", blurb: "How plants in eleven industries put Sintrol monitors to work.", open: { tab: "cases" } },
    { id: "certs", name: "Certified", title: "Certifications and approvals", blurb: "QAL1, EN 15859, MCERTS, NPL India, ATEX, IECEx, HazLoc and more.", open: { tab: "certs" } },
    { id: "network", name: "Distributors", title: "Global network", blurb: "Head office in Helsinki, offices in India and China, partners in 40 countries.", open: { tab: "network" } },
    { id: "furnace", name: "Furnace cams", title: "Furnace cameras", blurb: "Vulcan high-temperature imaging for combustion monitoring and control.", open: { tab: "products" } }
  ];

  /* ---------- Products ---------- */
  const P = {};
  function prod(id, o) {
    o.id = id;
    o.features = o.features || []; o.specs = o.specs || []; o.apps = o.apps || []; o.docs = o.docs || [];
    o.videos = o.videos || []; o.related = o.related || []; o.images = o.images || []; o.certs = o.certs || [];
    P[id] = o;
  }
  const IE = "Inductive Electrification";
  const ZONES_S = "Ex models: Zone 20, 21, 22 inside the duct; Zone 21, 22 outside";

  // ===== Emission monitoring =====
  prod("s305qal", {
    family: "emission", badge: "QAL1",
    name: "S305QAL", full: "S305QAL / S305QAL Ex Dust Monitor",
    tagline: "Certified for official particulate emissions reporting.",
    summary: "The S305QAL is an EN 15267-3 QAL1-certified particulate monitor for official stack emissions measurement, meeting EN 14181. It is approved for waste incineration and combustion plants, and is reliable, low-maintenance, sensitive and robust.",
    features: [
      "QAL1 certified to EN 15267-3; compliant with EN 14181 and EN 13284-2",
      "Lowest certified range 0 to 7.5 mg/m³; also 0 to 15 and 0 to 100 mg/m³",
      "Automatic zero and span checks",
      "Single opening into the stack, no alignment",
      "Auto Setup adapts to the process and sets range and alarms",
      "Flow velocity compensation and multipoint calibration",
      "Four-digit display, four keys and green, orange and red status LEDs",
      "4–20 mA, two SPDT relays and RS-485 Modbus RTU",
      "No consumable spare parts",
      "Ex model for Zone 20, 21, 22 inside and Zone 21, 22 outside the duct"
    ],
    specs: [
      ["Measures", "Total suspended particles (TSP)"],
      ["Principle", IE],
      ["Range", "Detection limit 0.01 mg/m³, up to several g/m³"],
      ["Certified ranges", "0–7.5, 0–15 and 0–100 mg/m³"],
      ["Duct size", "Up to 7,000 mm"],
      ["Outputs", "4–20 mA; 2 × SPDT relays, 30 VDC / 5 A or 240 VAC / 5 A"],
      ["Communication", "2 × RS-485 (Modbus RTU, VDI 4201), USB, DustTool"],
      ["Power", "24 VDC ±10 % or 100–240 VAC, 50/60 Hz, up to 10 W"],
      ["Enclosure", "Aluminium, IP66, 1.5 kg"],
      ["Probe", "316L stainless steel, 500 to 1,750 mm; PPS insulator"],
      ["Process", "Max. 300 °C (700 °C option); max. 600 kPa; 3–40 m/s"],
      ["Ambient", "−30 to +60 °C (certified −20 to +50 °C)"],
      ["Ex approval", "II 2 D Ex ia tb IIIC; US/CAN Zone 20, CL II DV 1"],
      ["Order codes", "S305QAL PC901026, S305QAL Ex PC901040"]
    ],
    regs: ["EC Directive 2000/76 (waste incineration)", "LCPD 2001/80/EC (large combustion plants)", "IED 2010/75/EU (industrial emissions)", "MCPD 2015/2193; Germany 27th, 30th and 44th BImSchV"],
    certs: ["qal1", "mcerts", "npl", "epa", "atex", "hazloc"],
    apps: ["emission"],
    images: ["s305qal"],
    callouts: [
      { x: 42, y: 50, text: "Four-digit display: mA, % or mg/m³" },
      { x: 37, y: 65, text: "Four keys and Auto Setup on site" },
      { x: 10, y: 40, text: "IP66 aluminium enclosure" },
      { x: 86, y: 22, text: "316L probe, 500 to 1,750 mm" },
      { x: 77, y: 34, text: "PPS insulator around the sensing probe" },
      { x: 66, y: 62, text: "Fits through one opening, no alignment" },
      { x: 58, y: 95, text: "4–20 mA, relays, RS-485 and USB" }
    ],
    docs: ["b-s305qal", "m-s305qal", "c-s305qal-qal1", "c-s305qal-mcerts", "c-s305qal-npl", "c-s305qal-probe", "c-atex-s300", "c-iecex-s300", "c-hazloc", "doc-s305qal"],
    videos: ["fuWeiSRVqG4"],
    related: ["s304", "exoqal", "s304qal", "dustcloud"]
  });

  prod("s304", {
    family: "emission",
    name: "S304", full: "S304 / S304 Ex Dust Monitor",
    tagline: "Dust in mg/m³, for process control and emissions.",
    summary: "The S304 is a continuous particulate monitor that can be calibrated to mass concentration (mg/m³), so operators know exactly how much dust passes through the stack or outlet duct. It suits baghouses, cyclones, dryers and other dust collection systems.",
    features: [
      "Calibrates to mass concentration in mg/m³",
      "Detection limit 0.01 mg/m³ with an extremely wide linear range",
      "Automatic zero and span checks",
      "Flow velocity compensation and multipoint calibration",
      "Commissioned in 500 seconds (about 8 minutes) after installation",
      "One-sided installation, ducts up to 7,000 mm",
      "4–20 mA, two SPDT relays, RS-485 Modbus RTU and USB",
      "Optional radio link: 868 or 915 MHz, up to 1,000 m",
      "IECEx, ATEX and HazLoc approved Ex model"
    ],
    specs: [
      ["Measures", "Total suspended particles (TSP)"],
      ["Principle", IE],
      ["Range", "Detection limit 0.01 mg/m³, up to several g/m³"],
      ["Duct size", "Up to 7,000 mm"],
      ["Outputs", "Isolated 4–20 mA (NAMUR NE 43); 2 × SPDT relays"],
      ["Communication", "2 × RS-485 Modbus RTU, USB, optional RF"],
      ["Power", "24 VDC ±10 % or 100–240 VAC, up to 10 W"],
      ["Enclosure", "Aluminium, IP66, 1.5 kg"],
      ["Probe", "316L stainless steel; PPS (Ryton R-4) insulator"],
      ["Process", "Max. 300 °C (700 °C option; Ex 200 °C); 600 kPa; 3–40 m/s"],
      ["Ambient", "−40 to +60 °C (Ex −30 to +60 °C)"],
      ["Hazardous areas", ZONES_S],
      ["Order codes", "S304 PC901025, S304 Ex PC901046"]
    ],
    certs: ["epa", "atex", "hazloc", "kcs"],
    apps: ["emission", "trend"],
    images: ["s304"],
    callouts: [
      { x: 42, y: 50, text: "Four-digit display and four keys" },
      { x: 30, y: 33, text: "Green, orange and red status LEDs" },
      { x: 10, y: 45, text: "IP66 aluminium, 1.5 kg" },
      { x: 86, y: 20, text: "Probe in the gas stream" },
      { x: 77, y: 33, text: "Insulator keeps the probe isolated" },
      { x: 58, y: 95, text: "mA, relays, RS-485, USB" }
    ],
    docs: ["b-s304", "m-s304", "x-s304", "c-atex-s300", "c-iecex-s300", "c-hazloc", "c-kcs-s300", "doc-s300", "doc-s300ex"],
    videos: ["eqqG8mRJjsc"],
    related: ["s305qal", "s303", "s314", "dusttool"]
  });

  prod("exoqal", {
    family: "emission", badge: "New",
    name: "EXO QAL", full: "EXO QAL Optical Wet Gas Extractive Dust Monitor",
    tagline: "Reliable dust measurement where in-situ monitors fail: wet stacks.",
    summary: "EXO QAL extracts a representative gas sample, heats it above the water and acid dew points and measures it optically. Moisture, droplets and condensation stop interfering, so particulate monitoring works downstream of wet scrubbers, wet ESPs and other gas-cleaning or cooling systems.",
    features: [
      "Ejector-based sampling with automatic probe back-purging",
      "Sample heated above the water and acid dew points",
      "Wideband white LED, optical forward scattering",
      "Patented protective air curtain keeps the optics clean, no dilution air",
      "Touchscreen for values, trends, alarms and diagnostics",
      "Ethernet TCP/IP for remote operation and troubleshooting",
      "Adjustable support frame and multiflange connection for retrofits",
      "Options for outdoor sites, cold climates and secure remote access"
    ],
    specs: [
      ["Principle", "Extractive optical forward scattering, LED-based"],
      ["Measures", "Total suspended particles (TSP)"],
      ["Particle size", "From 0.01 µm"],
      ["Detection limit", "From 0.1 mg/m³"],
      ["Range", "Up to 0–300 mg/m³, user changeable"],
      ["QAL1", "Pending: proposed 0–15 mg/m³, supplementary 0–300 mg/m³"],
      ["Process", "Wet, condensing flue gas with droplets; max. 200 °C; 0–25 m/s"],
      ["Ambient", "−40 to +50 °C (below 0 °C with winter package)"],
      ["Power", "100–230 VAC, 2,500 VA"],
      ["Communication", "Modbus RTU, Modbus TCP, Ethernet TCP/IP, USB"],
      ["Enclosure", "IP54"]
    ],
    steps: [
      ["Sample extraction", "An ejector continuously draws gas from the process through a heated sampling probe."],
      ["Sample conditioning", "The sample is heated above the water and acid dew points, vaporising droplets and preventing condensation."],
      ["Optical measurement", "The conditioned sample passes an optical cell where particulate concentration is measured continuously."],
      ["Sample discharge", "After measurement the sample returns to the process or vents to ambient air, depending on the installation."]
    ],
    uses: ["Biomass combustion", "Waste-to-energy and waste incineration", "Coal-fired power plants", "Chemical processing and acid production", "Petroleum refining", "Metals processing and foundries", "Battery materials and powder drying", "Odour control and air treatment"],
    certs: ["epa"],
    apps: ["emission"],
    images: ["exoqal", "exoqal-flow"],
    callouts: [
      { x: 24, y: 34, text: "Heated conditioning and optical cell in one cabinet" },
      { x: 46, y: 25, text: "Touchscreen: values, trends, alarms" },
      { x: 88, y: 31, text: "Heated sampling probe" },
      { x: 62, y: 82, text: "Adjustable frame for new and retrofit installs" }
    ],
    docs: ["b-exoqal", "b-exo", "m-exo"],
    related: ["exo", "s305qal", "s304", "dustcloud"]
  });

  prod("exo", {
    family: "emission",
    name: "EXO", full: "EXO Extractive Optical PM-CEMS for Wet Gases",
    tagline: "Extractive, isokinetic, temperature-controlled PM-CEMS.",
    summary: "EXO (EXtractive Optical) continuously measures dust in wet stacks, for example after wet scrubbers. A heated probe extracts the sample and vaporises the moisture; the dust then passes Sintrol's patented optical XO sensor module, where LED light scattered by the particles gives the concentration. It is calibrated to the process with a standard reference method.",
    features: [
      "Heated sampling probe, optical XO sensor and touchscreen on one frame",
      "External blower drives an ejector that draws the flue gas through and returns it to the stack",
      "Isokinetic sampling by parameter adjustment (option)",
      "Air curtain isolates the sample stream from the optics",
      "Continuous dust levels as low as 0.1 mg/m³",
      "LED light source copes with different particle size distributions",
      "Results in mg/m³ or 4–20 mA"
    ],
    specs: [
      ["Measurement", "Total dust, optical, LED-based, extractive"],
      ["Particle size", "From 0.01 µm"],
      ["Detection limit", "From 0.1 mg/m³"],
      ["Range", "0–500 mg/m³, user changeable"],
      ["Process", "Flue gas below dew point with droplets; max. 300 °C; 5–25 m/s"],
      ["Outputs", "2 × 4–20 mA, 2 × 8 digital outputs, Ethernet TCP/IP, USB"],
      ["Power", "400 V / 16 A three-phase; max. 3.7 kW"],
      ["Purge air", "Clean, dry instrument air 30 l/min, or a purge blower"],
      ["Calibration", "Standard reference method, gravimetric sampling"],
      ["Cabinet", "Powder-coated steel, IP54; 800 × 400 × 300 mm"],
      ["Weight", "About 120 kg fully assembled"]
    ],
    apps: ["emission"],
    images: ["exo"],
    docs: ["b-exo", "m-exo"],
    related: ["exoqal", "s305qal"]
  });

  // ===== Filtration and process =====
  prod("s101", {
    family: "filtration",
    name: "S101 / S103", full: "S101 / S103 Ex Filter Monitor",
    tagline: "Cost-effective broken-bag detection for ducts up to 800 mm.",
    summary: "The S100 series are robust, sensitive real-time monitors for leaks and broken filters, and give an indication of changing dust levels. They update the former Sintrol Snifter filter monitors. The S101 has two alarm relays; the S103 has a 4–20 mA output.",
    features: [
      "For ducts up to 800 mm",
      "Selectable response: fast, medium or slow",
      "S101: two relays for dust alarms",
      "S103: active, isolated 4–20 mA output",
      "Green, yellow and red LEDs show the dust level",
      "Rugged IP66 enclosure",
      "Auto Setup: commissioned in about 8 minutes",
      "S101 Ex and S103 Ex for Zone 22 inside and outside the duct"
    ],
    specs: [
      ["Measures", "Solid particles in gas flow"],
      ["Principle", IE],
      ["Range", "Detection limit 0.1 mg/m³, up to several g/m³"],
      ["Outputs", "S101: 2 × solid-state relays, 30 VDC / 200 mA. S103: 4–20 mA"],
      ["Communication", "RS-485, Modbus RTU"],
      ["Power", "24 VDC ±10 %, 1 W"],
      ["Connection", "1/2-inch NPT weld-on socket"],
      ["Probe", "250 mm, can be shortened; PEEK insulator"],
      ["Enclosure", "Aluminium, IP66, 0.7 kg"],
      ["Process", "Max. 250 °C (Ex 200 °C); max. 200 kPa; min. 3 m/s"],
      ["Ex approval", "ATEX II 3D Ex tc IIIC T80 °C Dc (Zone 22)"],
      ["Order codes", "S101 PC901005, S101 Ex PC901006, S103 PC901010, S103 Ex PC901011"]
    ],
    certs: ["atex"],
    apps: ["brokenbag", "blockage"],
    images: ["s101"],
    callouts: [
      { x: 47, y: 47, text: "Green, yellow, red LEDs" },
      { x: 12, y: 35, text: "IP66 aluminium, 0.7 kg" },
      { x: 88, y: 8, text: "250 mm probe, can be shortened" },
      { x: 72, y: 24, text: "PEEK insulator" },
      { x: 73, y: 93, text: "24 VDC, 1 W; relays or 4–20 mA" }
    ],
    docs: ["b-s101", "m-s101", "m-s103", "x-s100", "c-atex-s100", "c-iecex-s100", "doc-s100", "doc-s100ex"],
    videos: ["eqqG8mRJjsc"],
    related: ["s201", "s304qal", "dusttool"]
  });

  prod("s201", {
    family: "filtration",
    name: "S201", full: "S201 / S201 Ex Dust Monitor",
    tagline: "Broken-bag and filter-leak alarms with two adjustable relays.",
    summary: "The S201 identifies bag leaks, filter deterioration and broken bags. Two independent, manually adjustable relays let operators configure it to their needs, and three-colour status LEDs show filtration performance to anyone on the factory floor.",
    features: [
      "Ducts up to 7,000 mm",
      "Different sensor coatings available",
      "Auto Setup: commissioned in 500 seconds",
      "Detection limit 0.01 mg/m³, extremely wide linear range",
      "Clearly visible three-colour status LEDs",
      "Two independent SPDT relays and RS-485 Modbus RTU",
      "Single opening into the duct, no alignment",
      "IECEx, ATEX and HazLoc approved Ex model"
    ],
    specs: [
      ["Measures", "Total suspended particles (TSP)"],
      ["Principle", IE],
      ["Range", "Detection limit 0.01 mg/m³, up to several g/m³"],
      ["Outputs", "2 × SPDT relays, 30 VDC / 5 A or 240 VAC / 5 A"],
      ["Communication", "RS-485 Modbus RTU, USB"],
      ["Power", "24 VDC ±10 % or 100–240 VAC, up to 10 W"],
      ["Connection", "1 1/2-inch tri-clamp; PG11 gland"],
      ["Enclosure", "Aluminium, IP66, 1.5 kg"],
      ["Process", "Max. 300 °C (700 °C option; Ex 200 °C); max. 600 kPa"],
      ["Hazardous areas", ZONES_S],
      ["Order codes", "S201 PC901013, S201 Ex PC901014"]
    ],
    certs: ["atex", "hazloc", "kcs"],
    apps: ["brokenbag", "trend"],
    images: ["s201"],
    docs: ["b-s201", "m-s201", "x-s201", "c-atex-s300", "c-iecex-s300", "c-hazloc", "c-kcs-s300", "doc-s300", "doc-s300ex"],
    related: ["s203", "s101", "s304qal"]
  });

  prod("s203", {
    family: "filtration",
    name: "S203", full: "S203 / S203 Ex Dust Monitor",
    tagline: "A continuous trend monitor for filtration systems.",
    summary: "The S203 shows how a filtration system performs over time. It fits after any filter or in common channels leading to a plant's emission points, with a 4–20 mA output and three-colour status LEDs that anyone on the floor can read.",
    features: [
      "Ducts up to 7,000 mm; S203-W for 4 to 10 m ducts",
      "Active, isolated 4–20 mA plus two SPDT relays",
      "Different sensor coatings available",
      "Auto Setup: commissioned in 500 seconds",
      "Detection limit 0.01 mg/m³, linear response",
      "RS-485 Modbus RTU",
      "IECEx, ATEX and HazLoc approved Ex model"
    ],
    specs: [
      ["Measures", "Total suspended particles (TSP)"],
      ["Principle", IE],
      ["Range", "Detection limit 0.01 mg/m³, up to several g/m³"],
      ["Outputs", "Isolated 4–20 mA (max. 250 Ω); 2 × SPDT relays"],
      ["Communication", "RS-485 Modbus RTU, USB"],
      ["Power", "24 VDC ±10 % or 100–240 VAC, up to 10 W"],
      ["Connection", "1 1/2-inch tri-clamp; PG11 gland"],
      ["Enclosure", "Aluminium, IP66, 1.5 kg"],
      ["Process", "Max. 300 °C (700 °C option; Ex 200 °C); max. 600 kPa"],
      ["Hazardous areas", ZONES_S],
      ["Order codes", "S203 PC901012, S203 Ex PC901024"]
    ],
    certs: ["atex", "hazloc", "kcs"],
    apps: ["brokenbag", "trend", "blockage", "extraction"],
    images: ["s203"],
    docs: ["b-s201", "m-s201", "x-s201", "c-atex-s300", "c-iecex-s300", "c-hazloc", "c-kcs-s300", "doc-s300", "doc-s300ex"],
    related: ["s201", "s303", "s304"]
  });

  prod("s303", {
    family: "filtration",
    name: "S303", full: "S303 / S303 Ex Dust Monitor",
    tagline: "A process monitor with a local display.",
    summary: "The S303 lets plant operators see how their filtration system performs over a period, with a 4–20 mA output for continuous dust measurement. It suits any filtration outlet or common channel leading to a plant's emission points.",
    features: [
      "Ducts up to 7,000 mm, one-sided installation",
      "Local four-digit display and four keys",
      "Multipoint calibration",
      "Auto Setup: commissioned in 500 seconds",
      "4–20 mA, two SPDT relays, RS-485 Modbus RTU and USB",
      "Optional radio link, up to 1,000 m",
      "IECEx, ATEX and HazLoc approved Ex model"
    ],
    specs: [
      ["Measures", "Total suspended particles (TSP)"],
      ["Principle", IE],
      ["Range", "Detection limit 0.01 mg/m³, up to several g/m³"],
      ["Outputs", "Isolated 4–20 mA (NAMUR NE 43); 2 × SPDT relays"],
      ["Communication", "2 × RS-485 Modbus RTU, USB, optional RF"],
      ["Power", "24 VDC ±10 % or 100–240 VAC, up to 10 W"],
      ["Enclosure", "Aluminium, IP66, 1.5 kg"],
      ["Process", "Max. 300 °C (700 °C option; Ex 200 °C); 600 kPa; 3–40 m/s"],
      ["Hazardous areas", ZONES_S],
      ["Order codes", "S303 PC901022, S303 Ex PC901043"]
    ],
    certs: ["atex", "hazloc", "kcs"],
    apps: ["trend", "extraction"],
    images: ["s303"],
    docs: ["b-s304", "m-s304", "x-s304", "c-atex-s300", "c-iecex-s300", "c-hazloc", "c-kcs-s300", "doc-s300", "doc-s300ex"],
    related: ["s304", "s203", "espy"]
  });

  prod("s304qal", {
    family: "filtration", badge: "EN 15859",
    name: "S304QAL-L / -D", full: "S304QAL-L Filter Leakage Monitor and S304QAL-D Filter Dust Monitor",
    tagline: "QAL-certified filter leakage and filter dust monitoring.",
    summary: "The S304QAL series accurately detects dust leakage or monitors filter performance in highly demanding processes. Certified to EN 15859, it measures total suspended particles after dust arrestment plants: the S304QAL-L with relay outputs, the S304QAL-D with an isolated 4–20 mA output calibrated in mg/m³.",
    features: [
      "QAL certified as a filter leakage monitor and a filter dust monitor",
      "Conforms to EN 15859:2010",
      "Certified ranges 0–7.5, 0–15 and 0–100 mg/m³",
      "Flow rate compensation for 3 to 40 m/s via mA input",
      "No consumables, minimal cleaning, automatic zero and span checks",
      "10-minute commissioning with Auto Setup",
      "Air purge and high-temperature connectors up to 700 °C (options)",
      "RS-485 Modbus RTU (VDI 4201) and USB with DustTool"
    ],
    specs: [
      ["Measures", "Total suspended particles (TSP)"],
      ["Principle", IE],
      ["Certified ranges", "0–7.5, 0–15 and 0–100 mg/m³; detection limit 0.01 mg/m³"],
      ["S304QAL-L output", "2 × SPDT relays, certified to EN 15859"],
      ["S304QAL-D output", "Isolated 4–20 mA, certified to EN 15859"],
      ["Communication", "2 × RS-485 Modbus RTU (VDI 4201), USB"],
      ["Power", "24 VDC ±10 % or 100–240 VAC, up to 10 W"],
      ["Enclosure", "Aluminium, IP66, 1.5 kg"],
      ["Probe", "316L, 250 mm standard, up to 1,750 mm; PTFE coating option"],
      ["Process", "Max. 300 °C (700 °C option); 600 kPa; 3–40 m/s"],
      ["Ambient", "−20 to +50 °C"],
      ["Order codes", "-L PC901027, -D PC901028, -L Ex PC901047, -D Ex PC901048"]
    ],
    certs: ["en15859"],
    apps: ["brokenbag", "pneumatic"],
    images: ["s304qal"],
    callouts: [
      { x: 44, y: 48, text: "Display with status indication" },
      { x: 10, y: 40, text: "IP66 aluminium enclosure" },
      { x: 88, y: 20, text: "316L probe up to 1,750 mm" },
      { x: 78, y: 33, text: "PPS insulator" },
      { x: 58, y: 95, text: "Relays (-L) or 4–20 mA (-D)" }
    ],
    docs: ["b-s304qal", "m-s304qal", "c-s304qal-l", "c-s304qal-d", "doc-s304qal"],
    videos: ["eqqG8mRJjsc"],
    related: ["s101", "s201", "s305qal"]
  });

  prod("s314", {
    family: "filtration", badge: "New",
    name: "S314 / S314 Ex", full: "S314 / S314 Ex Split Architecture Dust Monitor",
    tagline: "The sensor at the duct, the electronics where you can reach them.",
    summary: "The S314 separates the Dust Sensor Unit (DSU) from the Connection Unit (CU). The sensor mounts at the measurement point while the electronics sit up to 500 m away at ground level or another safe, accessible spot. The S314 Ex DSU is certified for Zone 0, 1, 2 gas and Zone 20, 21, 22 dust atmospheres.",
    features: [
      "Interconnection cable up to 500 m between sensor and electronics",
      "Easier access: inspections and maintenance at ground level",
      "Safer maintenance: less scaffolding, lifting gear and permits",
      "Better visibility: read values and device health from a convenient place",
      "S314 Ex DSU for Zone 0, 1, 2 gas and Zone 20, 21, 22 dust",
      "Two SPDT relays, isolated 4–20 mA, 2 × RS-485 and USB",
      "Probe 250 to 1,750 mm; ducts 0.2 to 7 m"
    ],
    specs: [
      ["Measures", "Total suspended particles (TSP)"],
      ["Principle", IE],
      ["Range", "Detection limit 0.01 mg/m³, up to several g/m³"],
      ["Outputs", "2 × SPDT relays; isolated active 4–20 mA"],
      ["Communication", "2 × RS-485 Modbus RTU; USB"],
      ["Power", "24 VDC ±10 % or 100–240 VAC, 50/60 Hz"],
      ["Cable", "Customer supplied, up to 500 m"],
      ["Probe", "500 mm standard, 250 mm option, up to 1,750 mm"],
      ["Duct diameter", "0.2 to 7.0 m"],
      ["Process", "S314 max. 300 °C (700 °C option); S314 Ex max. 200 °C; up to 600 kPa"],
      ["Flow velocity", "3 to 40 m/s"],
      ["Ambient", "S314 −40 to +60 °C; S314 Ex −30 to +60 °C"],
      ["Ingress protection", "IP66"],
      ["Order codes", "S314 PC901054, S314 Ex PC901056"]
    ],
    uses: ["Food and grain processing", "Agricultural and ethanol processes", "Cement", "Mining and minerals", "Chemical", "Petrochemical", "Biomass and bioenergy", "Power and waste-to-energy"],
    certs: ["atex", "epa"],
    apps: ["explosion", "emission", "trend"],
    images: ["s314", "s314-user"],
    callouts: [
      { x: 30, y: 62, text: "Connection Unit: electronics and outputs in a safe area" },
      { x: 12, y: 28, text: "Powder-coated steel, IP66" },
      { x: 87, y: 32, text: "Dust Sensor Unit at the measurement point" },
      { x: 56, y: 11, text: "Probe 250 to 1,750 mm" }
    ],
    docs: ["b-s314"],
    related: ["s304", "s203", "dumopro"]
  });

  prod("espy", {
    family: "filtration",
    name: "E-SPY", full: "E-SPY Dust Monitor for Post-ESP Applications",
    tagline: "The probe-based monitor proven to work after an ESP.",
    summary: "E-SPY is the only probe-based dust monitor proven to be a reliable trend monitor after electrostatic precipitators. It neutralises the electrostatic field in the ESP outlet duct and gives a trend of relative dust concentration, so operators can optimise ESP operation and rapping.",
    features: [
      "Neutralises the electrostatic field in the ESP outlet duct",
      "Continuous relative dust trend for ESP control",
      "Judge ESP performance from the output signal; spot maintenance needs",
      "Optimise rapping to cut energy use and emissions",
      "No optics to misalign from vibration, no clean dry purge air",
      "Hundreds installed worldwide, replacing opacity monitors",
      "Automatic set-up procedure"
    ],
    specs: [
      ["System", "E-Spy probe enclosure with an S303 monitor"],
      ["Principle", IE],
      ["Range", "Detection limit 0.01 mg/m³, up to several g/m³"],
      ["Outputs", "Isolated 4–20 mA (NAMUR NE 43); 2 × SPDT relays"],
      ["Communication", "2 × RS-485 Modbus RTU, USB, optional RF"],
      ["Power", "24 VDC ±10 % or 100–240 VAC, up to 10 W"],
      ["Process", "Max. 300 °C (700 °C option); 600 kPa; 3–40 m/s"],
      ["Weight", "5.7 to 7.5 kg"],
      ["Enclosure", "Aluminium, IP66"]
    ],
    uses: ["Power and electricity generation", "Cement", "Chemicals", "Metals", "Paper"],
    apps: ["esp"],
    images: ["espy"],
    callouts: [
      { x: 16, y: 72, text: "S303 monitor with display" },
      { x: 42, y: 22, text: "Flange mounts on the ESP outlet duct" },
      { x: 76, y: 24, text: "Shielded probe neutralises the electrostatic field" }
    ],
    docs: ["b-espy", "m-espy"],
    related: ["s303", "s305qal", "exoqal"]
  });

  // ===== Workplace and ambient =====
  prod("dumopro", {
    family: "ambient",
    name: "DumoPro", full: "DumoPro / DumoPro Ex Continuous Ambient Dust Monitor",
    tagline: "Airborne dust detection, 24/7, in demanding industrial environments.",
    summary: "DumoPro measures dust concentration in industrial environments. Its field-proven technology is highly sensitive to total suspended particles and tolerant of sensor contamination. Typical sites: flour and sugar mills, mining, wood products, grain handling, chemicals, power plants and any bulk or powder handling facility.",
    features: [
      "Internal fan draws a steady airflow through the measuring channel",
      "Auto Setup sets alarms at 5× and 20× the reference dust level",
      "Self-monitoring diagnostics and failsafe operation",
      "Fan speed is monitored; a blocked fan triggers an error",
      "Periodic zero and span check and correction",
      "On-board display for dust level or mA output",
      "Two relays, isolated 4–20 mA, RS-485 and USB",
      "DumoPro Ex for Zones 20, 21 and 22; Auto Setup without opening it"
    ],
    specs: [
      ["Measures", "Total suspended particles (TSP)"],
      ["Principle", IE],
      ["Range", "Detection limit 0.01 mg/m³, up to several g/m³"],
      ["Outputs", "2 × solid-state relays, 30 VDC / 1 A; isolated 4–20 mA (NE 43)"],
      ["Communication", "RS-485 Modbus RTU, USB"],
      ["Alarms", "Auto Setup: 5× and 20× reference level; adjustable"],
      ["Averaging", "100 s default, 0 to 6,000 s"],
      ["Power", "24 VDC ±10 %, up to 10 W"],
      ["Enclosure", "Aluminium, stainless cover plates and probe; IP66"],
      ["Size and weight", "311 × 191 × 174 mm, 4.2 kg"],
      ["Ambient", "−40 to +60 °C, max. 95 % RH"],
      ["Ex approval", "II 1 D Ex ia ta IIIC T200 93 °C Da; US Zone 20"],
      ["Order codes", "DumoPro PC901600, DumoPro Ex PC901080"]
    ],
    uses: ["Health and hygiene", "Equipment safety", "Good housekeeping", "Dust explosion risk mitigation", "HazLoc monitoring", "Detecting unwanted events"],
    certs: ["atex", "hazloc", "kcs"],
    apps: ["workplace", "explosion"],
    images: ["dumopro", "dumopro-ex", "dumopro-side", "dumopro-dusttool"],
    callouts: [
      { x: 72, y: 44, text: "Internal fan: steady airflow past the probe" },
      { x: 68, y: 86, text: "On-board display" },
      { x: 83, y: 85, text: "Status LED" },
      { x: 28, y: 22, text: "Extruded, pressure-cast aluminium" },
      { x: 18, y: 62, text: "IP66; Ex model for Zones 20, 21, 22" }
    ],
    docs: ["b-dumopro", "m-dumopro", "x-dumopro", "c-atex-dumopro", "c-iecex-dumopro", "c-hazloc", "c-kcs-dumopro", "doc-dumopro", "doc-dumoproex"],
    videos: ["-3yDoe6_aU8"],
    related: ["dustcloud", "s314", "dusttool"]
  });

  // ===== Software =====
  prod("dustcloud", {
    family: "software", badge: "New",
    name: "DustCloud", full: "DustCloud Cloud-Based Dust Monitoring Service",
    tagline: "Every monitor, every site, one view.",
    summary: "DustCloud brings measurement data, device status and alerts from supported Sintrol monitors into one cloud service. Monitor many locations remotely, spot abnormal dust levels or device problems, and get the information you need for follow-up and reporting, in a browser or the Android and iOS apps.",
    features: [
      "Map, device-list and overview views of every connected monitor",
      "4G or LoRaWAN: less cabling across large sites",
      "Trends with 15-minute, hourly and daily averages",
      "Email and SMS alerts for thresholds, offline devices and faults",
      "Dust events shown beside diagnostics, so you can tell process from instrument",
      "Dashboards and reports; export to Excel or CSV",
      "Delivered preconfigured; Sintrol runs and updates the service",
      "The customer keeps ownership of its data; role-based access"
    ],
    specs: [
      ["Service model", "Cloud-based SaaS"],
      ["Devices", "Supported Sintrol dust monitors and approved communication modules"],
      ["Connectivity", "4G or LoRaWAN, depending on configuration"],
      ["Data interval", "20 s with 4G; 60 s with LoRaWAN"],
      ["Views", "Current and historical trends; 15-min, hourly and daily averages"],
      ["Access", "Web browser, Android and iOS"],
      ["Device link", "One-way"],
      ["Data retention", "12 months standard"],
      ["Setup", "Preconfigured by Sintrol"]
    ],
    steps: [
      ["Measure", "Supported Sintrol monitors measure dust and run their own diagnostics."],
      ["Send", "A communication module sends data over 4G or LoRaWAN."],
      ["Store and alert", "DustCloud stores the data, builds dashboards and raises alerts."],
      ["Act", "Authorised users see it all on the web or in the mobile apps."]
    ],
    apps: ["workplace", "emission"],
    images: ["dustcloud-flow", "dustcloud-views", "dustcloud-multisite", "dustcloud-hero"],
    docs: ["b-dustcloud"],
    related: ["dumopro", "s305qal", "dusttool"]
  });

  prod("dusttool", {
    family: "software", badge: "Free",
    name: "DustTool", full: "DustTool 2 Configuration Software",
    tagline: "Free configuration software for Sintrol dust monitors.",
    summary: "DustTool 2 configures DumoPro, S100, S200 and S300 series monitors (the previous DustTool covers Snifter and Dumo). It makes commissioning quicker and gets the most from every monitor.",
    features: [
      "Device name and averaging time",
      "4–20 mA range adjustment",
      "Calibration to mg/m³",
      "Start Auto Setup",
      "Zero and span intervals",
      "Alarm display",
      "Flow compensation set-up",
      "Live monitor output screen"
    ],
    specs: [
      ["Price", "Free of charge"],
      ["Supports", "DumoPro, S100, S200 and S300 series (DustTool 2)"],
      ["Previous version", "DustTool 1 for Snifter and Dumo"],
      ["Connection", "USB, or RS-485 with a USB converter"],
      ["Download", "sintrol.fi/international, DustTool page"]
    ],
    images: ["dusttool", "dumopro-dusttool"],
    docs: ["m-dusttool"],
    videos: ["4fiDTzDlLZ8"],
    related: ["dustcloud", "s304", "dumopro"]
  });

  // ===== Furnace cameras =====
  prod("vulcan", {
    family: "furnace",
    name: "Vulcan cameras", full: "Sintrol Vulcan High-Temperature Imaging Systems",
    tagline: "See the flame and the bed, through smoke and ash.",
    summary: "The Vulcan family gives a reliable view into the process even through smoke and ash. It shows the behaviour of the flame and bed, gives a real-time temperature map of the whole image with Pyro-Viper HD software, and supports automatic combustion control. Every system is custom designed, from the process to the control room.",
    features: [
      "Vulcan 12MT: smelt-bed camera for recovery boilers, power boilers and steel",
      "Vulcan 12C-2C: video plus temperature data from twin camera cores",
      "Vulcan 12CS: high-quality video where temperature data is not needed",
      "Real-time temperature measurement across the whole image",
      "Detects anomalies such as possible water leaks in real time",
      "Quick-change design; indestructible STEELON™ housings",
      "Low cooling-air consumption and long service life",
      "Options: retract assemblies, deslagger, portable cart, fibre, Ethernet or wireless"
    ],
    specs: [
      ["Sensor", "Solid-state IR and/or CCD"],
      ["Temperature measurement", "600 °C up to 2,000 °C"],
      ["Lens", "Air-cooled stainless steel, wavelength optimised; 42 mm diameter"],
      ["Length", "Custom, usually 24 to 65 inches"],
      ["Line of sight", "Straight; 45° and 90° available"],
      ["Lens purge air", "34 m³/h at 1 bar"],
      ["Housing", "STEELON™ (stainless over high-temperature synthetic); nylon IP66 option"],
      ["Installation ambient", "Up to 290 °C"],
      ["Power", "12 VDC with 100–240 VAC adapter"]
    ],
    uses: ["Recovery (soda) boilers", "Lime and cement kilns", "Bubbling fluidised bed boilers", "Grate-fired plants", "Smelters"],
    images: ["vulcan-thermal", "vulcan12mt", "vulcan-kiln", "vulcan-limekiln", "vulcan-bw"],
    docs: ["b-vulcan"],
    videos: ["Q7utbRBGvXg"],
    related: ["s305qal", "exoqal"]
  });

  /* ---------- Applications (the application finder) ---------- */
  const apps = [
    { id: "emission", name: "Emission monitoring", sub: "Dry and wet gas", img: "emission-bg",
      desc: "Ensure compliance and protect the environment. Sintrol monitors deliver accurate results in dry or wet gas, helping you meet regulations, optimise processes and avoid costly penalties.",
      products: ["s305qal", "s304", "exoqal", "s314", "exo"], cases: ["rcc", "bagasse", "power"] },
    { id: "explosion", name: "Dust explosion prevention", sub: "Early warning", img: "reason-explosion",
      desc: "Protect people, equipment and facilities. Monitors track dust concentration continuously, giving early warnings and time for preventive action to reduce explosion risk.",
      products: ["dumopro", "s314"], cases: ["grain", "sugar"] },
    { id: "brokenbag", name: "Broken bag detection", sub: "Filter leaks", img: "filter-bg",
      desc: "Minimise downtime and protect downstream equipment. Reliable detection of filter failures gives immediate alerts, cutting product loss and maintenance costs.",
      products: ["s101", "s201", "s203", "s304qal"], cases: ["wood", "flour", "steel", "cement", "feed"] },
    { id: "esp", name: "ESP optimisation", sub: "After the precipitator", img: "case-power",
      desc: "Get the most from electrostatic precipitators. Real-time feedback lets you fine-tune ESP operation, improving collection efficiency and lowering operating costs.",
      products: ["espy"], cases: ["power"] },
    { id: "trend", name: "Process trend monitoring", sub: "Insight into the process", img: "case-steel",
      desc: "Track dust trends over time and make proactive adjustments that improve product quality and reduce waste.",
      products: ["s201", "s203", "s303", "s304", "s314"], cases: ["steel", "cement"] },
    { id: "workplace", name: "Workplace dust monitoring", sub: "People and conditions", img: "case-metal",
      desc: "Safeguard employee health and meet occupational safety standards with continuous monitoring of dust levels in workspaces.",
      products: ["dumopro", "dustcloud"], cases: ["metal", "sugar"] },
    { id: "blockage", name: "Blockage monitoring", sub: "Before production stops", img: "technician",
      desc: "Detect build-ups or blockages in critical areas and act before production stops or equipment is damaged.",
      products: ["s101", "s203"], cases: [] },
    { id: "extraction", name: "Extraction flow optimisation", sub: "Dust collection that works", img: "case-wood",
      desc: "Keep dust collection running efficiently. Measuring before filtration verifies that extraction collects dust where needed; measuring after it verifies compliance.",
      products: ["s203", "s303"], cases: ["wood"] },
    { id: "pneumatic", name: "Pneumatic conveyors", sub: "Leaks and abnormalities", img: "case-flour",
      desc: "Real-time visibility into pneumatic conveying lines: detect leaks or abnormalities to improve efficiency and reduce maintenance.",
      products: ["s304qal", "s101"], cases: ["flour"] }
  ];

  const industries = ["Power and energy", "Cement and building materials", "Food and feed", "Grain handling", "Sugar", "Mining and minerals",
    "Metals and steel", "Chemical and pharmaceutical", "Wood, pulp and paper", "Waste-to-energy", "Biomass", "Petroleum refining", "Battery materials", "Poultry houses"];

  /* ---------- Reference cases ---------- */
  const cases = [
    { id: "grain", title: "Preventing dust explosion hazards in grain handling", short: "Grain tunnel, Brazil", where: "Oil seed processing plant, Brazil", industry: "Grain handling",
      img: "case-grain", sq: "case-grain",
      stats: [["PLC", "dust data linked to plant control"], ["Hidden leak", "ruptured grain spout seal found early"], ["Safe entry", "staff enter only at safe dust levels"]],
      challenge: "Underground conveyor tunnels move grain between processing stages and are rarely entered, so dust can build up unnoticed until it reaches dangerous levels. A 2023 tunnel dust explosion at a similar plant in southern Brazil killed ten people.",
      solution: "The plant installed Sintrol DumoPro real-time dust monitoring, integrated into its PLC process control and supplied through Grunn do Brasil, Sintrol's local representative.",
      how: "DumoPro measures total suspended particles continuously. Linked to the PLC, its readings also decide when the tunnel is safe to enter.",
      headline: "A hidden hazard found and fixed before it became critical.",
      results: ["An unusual rise in dust led maintenance to a ruptured grain spout seal", "The leak was repaired and the build-up removed before it became critical", "Personnel enter the tunnel only once dust has fallen to safe levels", "Monitoring data now shapes inspection routines for unattended areas"],
      products: ["dumopro", "dustcloud"], apps: ["explosion", "workplace"], video: "-3yDoe6_aU8" },
    { id: "sugar", title: "Ambient dust monitoring in sugar silos and conveying areas", short: "Sugar silos, Europe", where: "European sugar plant", industry: "Sugar",
      img: "case-sugar", sq: "case-sugar",
      stats: [["6", "monitoring points under continuous supervision"], ["200,000+ t", "granulated sugar a year"], ["4–20 mA → DCS", "tied into the fire alarm system"]],
      challenge: "Unloading blockages can spill sugar and raise a large dust cloud; leaks at extraction points around each silo base can release dust locally; and a blockage in the conveyor tunnel quickly leads to accumulation and airborne dust.",
      solution: "Six Sintrol Dumo ambient monitors were installed at the risk points in an ATEX-classified area: silo unloading, silo bases and the conveyor tunnel. Their 4–20 mA signals go to the plant DCS, which is interfaced with the fire alarm system.",
      how: "Sintrol's ambient monitors use Inductive Electrification to follow total suspended particles in the air, turning the sensor response into a continuous dust trend with alarms.",
      headline: "Continuous visibility where process failures cause product loss and sudden dust releases.",
      results: ["Earlier indication of abnormal dust releases around silos and conveyors", "Faster response to unloading blockages, spills and local leaks", "Dust alarms integrated into the DCS and fire alarm system", "Better support for housekeeping and combustible dust risk management"],
      products: ["dumopro", "dustcloud"], apps: ["explosion", "workplace"], doc: "an-sugar" },
    { id: "wood", title: "Bag filter management in wood processing", short: "Wood processing, Germany", where: "German maker of baghouse systems for wood processing", industry: "Wood processing",
      img: "case-wood", sq: "case-wood-sq",
      stats: [["3 → 30", "trial plants to installations"], ["Per compartment", "dust measured downstream of each filter"], ["Faster", "detection of filter failures"]],
      challenge: "Filtered air is recirculated back into the workshop, so a filter failure must be detected quickly and traced to the affected compartment. Differential pressure only indicated problems indirectly.",
      solution: "A Sintrol Snifter monitor went into the outlet duct of each baghouse compartment. Auto Setup established the normal dust level and alarms were configured in Sintrol DustTool.",
      how: "Sintrol filter monitors use Inductive Electrification: particles touching or passing an insulated probe generate a signal that algorithms turn into a measure of changing dust levels.",
      headline: "From three trial plants to 30 installations.",
      results: ["Faster detection of filter failures", "The affected baghouse compartment identified directly", "Targeted maintenance and less risk of dust returning to the workshop"],
      products: ["s101", "s304qal", "dusttool"], apps: ["brokenbag", "extraction"], doc: "an-wood" },
    { id: "flour", title: "Filter leak detection in flour milling", short: "Flour mill, Finland", where: "Finnish flour mill, about 400 tonnes a day", industry: "Food",
      img: "case-flour", sq: "case-flour",
      stats: [["21", "Sintrol dust monitors"], ["400 t/day", "rye, wheat and oat flours and mixes"], ["4–20 mA → DCS", "plus RS-485 data logging"]],
      challenge: "A small filter leak could release flour into an unseen area such as a roof space, where it could grow microbes or attract rodents and insects before anyone found it.",
      solution: "21 Sintrol Snifter monitors were installed at critical points downstream of filtration, connected to the DCS by 4–20 mA. RS-485 to Sintrol DustLog 8 was used for logging and comparison with earlier monitors.",
      how: "Inductive Electrification detects small leaks and larger failures downstream of the filters as continuous changes in dust level.",
      headline: "Twenty-one critical post-filter points under continuous supervision.",
      results: ["Earlier detection of small filter leaks", "Real-time alarms for filter leakage", "Better supervision of unmanned post-filter areas"],
      products: ["s101", "s304qal", "dustcloud"], apps: ["brokenbag", "pneumatic"], doc: "an-flour" },
    { id: "cement", title: "Dust monitoring in cement manufacturing", short: "Cement, multinational", where: "Multinational cement producer", industry: "Cement",
      img: "case-cement", sq: "case-cement-sq",
      stats: [["4 countries", "plants now running Sintrol"], ["Earlier", "than differential pressure showed"], ["4 × S303", "trend monitors on stack inlets"]],
      challenge: "Product loss. The plant relied on differential pressure gauges and visual signs of filter failure, which did not give early or precise enough warning across crushing, kiln, clinker milling and packaging.",
      solution: "Sintrol Snifter monitors went on the baghouse outlet ducts and four S303 trend monitors on the stack inlet ducts, all connected to Sintrol DustLog software for central monitoring.",
      how: "Leak detection at each baghouse plus trend information at the stacks showed deteriorating or ruptured bags before differential pressure changed.",
      headline: "From the original installation to plants in four countries.",
      results: ["Earlier detection of filter deterioration and bag failures", "Faster isolation of the affected baghouse compartment", "More targeted maintenance and less cement lost to the atmosphere", "Better visibility into filtration performance"],
      products: ["s101", "s203", "s303", "s304", "s305qal", "s304qal"], apps: ["brokenbag", "trend"], doc: "an-cement" },
    { id: "steel", title: "Dust monitoring across the steel manufacturing process", short: "Steel, Europe", where: "Large European steel producer", industry: "Steel",
      img: "case-steel", sq: "case-steel",
      stats: [["3–5", "shutdowns a month from bag failures"], ["10–15 h", "of downtime a month before"], ["Hours", "of availability recovered each month"]],
      challenge: "The plant shut down three to five times a month because of bag-filter failures. Each stop lasted two to three hours while teams found and replaced the bags.",
      solution: "Sintrol Snifter monitors on each baghouse compartment detect broken or deteriorating bags; S303 trend monitors at the outlets; everything connected to DustLog software.",
      how: "Compartment-level leak detection plus continuous trends, read together with the cleaning cycle, let maintenance pinpoint the faulty baghouse.",
      headline: "Several hours of plant availability recovered each month.",
      results: ["Earlier detection of deteriorating and broken bags", "Faster location of the affected compartment", "Less downtime for filter maintenance", "Better visibility into filtration performance"],
      products: ["s101", "s203", "s303", "espy"], apps: ["brokenbag", "trend"], doc: "an-steel" },
    { id: "power", title: "Post-ESP dust monitoring in a coal-fired power plant", short: "Power plant, post-ESP", where: "Large coal-fired power plant", industry: "Power generation",
      img: "case-power", sq: "case-power-sq",
      stats: [["1 → 4", "E-SPY measurement points"], ["1 month", "side by side with an opacity monitor"], ["4–20 mA", "into the plant control system"]],
      challenge: "The plant needed dust data right after its ESPs to optimise rapping. The opacity monitor there needed heavy maintenance and was often knocked out of alignment by vibration.",
      solution: "During a one-month trial an E-SPY was installed beside the opacity monitor, its 4–20 mA output wired to the control system.",
      how: "E-SPY neutralises the electrostatic field in the outlet duct, so its Inductive Electrification probe gives a stable relative dust trend.",
      headline: "From one trial unit to four E-SPY measurement points.",
      results: ["The opacity system was removed at the trial point", "Three more E-SPY monitors ordered", "A direct process signal for optimising ESP rapping", "No optical alignment problems from vibration"],
      products: ["espy", "s305qal", "exoqal"], apps: ["esp"], doc: "an-power" },
    { id: "metal", title: "Workplace dust monitoring in metallurgical workshops", short: "Metallurgy, Europe", where: "Global metallurgical company, main European plant", industry: "Metals",
      img: "case-metal", sq: "case-metal",
      stats: [["2 → all", "from a two-monitor trial to every workshop"], ["4× and 10×", "normal dust level alarm relays"], ["Zero", "cleaning or adjustment during the trial"]],
      challenge: "Dozens of workshops each have dust extraction. The opacity-based monitors needed frequent maintenance, gave false alarms and sat in hard-to-reach places.",
      solution: "A three-month trial put two Sintrol Dumo monitors beside the existing system. Auto Setup at commissioning; relays at four and ten times the normal level; 4–20 mA trends.",
      how: "Continuous ambient trends show dust spikes and the effect of cleaning cycles and production in each workshop.",
      headline: "From a two-monitor trial to a Dumo in every workshop, and other sites next.",
      results: ["More reliable visibility of workplace dust trends", "Earlier indication of abnormal conditions", "Lower maintenance than the opacity system", "Better data on extraction and cleaning performance"],
      products: ["dumopro", "dustcloud"], apps: ["workplace"], doc: "an-metal" },
    { id: "rcc", title: "Dust measurement in reinforced concrete stacks", short: "Concrete stack, Asia", where: "Coal-fired power plant stack, Asia", industry: "Power generation",
      img: "case-rcc", sq: "case-rcc",
      stats: [["500 mm", "thick concrete wall at the probe"], ["35–40 mg/m³", "measured reliably"], ["No purge air", "needed"]],
      challenge: "Concrete conducts heat poorly, so the wall penetration was much cooler than the flue gas. Moisture and wet dust formed around the S305 probe mounting.",
      solution: "Sintrol designed an airtight protective cage around the probe through the full wall thickness, isolating it from the condensation while leaving the sensing section in the flue gas.",
      how: "S305QAL uses Inductive Electrification; in concrete stacks the installation design keeps local condensation off the probe. Where the gas itself is wet, EXO QAL measures extractively instead.",
      headline: "Reliable dust measurement despite local condensation.",
      results: ["Condensation kept away from the sensing probe", "No purge air required", "Stable measurement at about 35–40 mg/m³", "Long-term operation through a 500 mm wall"],
      products: ["s305qal", "exoqal", "s304"], apps: ["emission"], doc: "an-rcc" },
    { id: "bagasse", title: "Extractive optical PM-CEMS in bagasse-fired boilers", short: "Sugar mill boilers", where: "Biomass bagasse-fired boilers at sugar mills", industry: "Biomass and sugar",
      img: "case-bagasse", sq: "case-bagasse",
      stats: [["150–320 mg/m³", "typical local PM limits"], ["Wet scrubbers", "add moisture to the flue gas"], ["EXO", "extractive, isokinetic, heated"]],
      challenge: "Bagasse, the fibre left after crushing sugarcane, fires boilers that power the mill and export electricity. High ambient dust, high temperatures and wet scrubbers make PM measurement hard: the gas must be dried first.",
      solution: "Sintrol EXO extracts the sample isokinetically, heats it to prevent condensation errors and measures it in a patented optical module with built-in dirt prevention.",
      how: "Temperature-controlled extraction removes the moisture; optical forward scattering measures the remaining particles.",
      headline: "Accurate wet-stack PM monitoring for compliance and boiler efficiency.",
      results: ["Reliable performance in high humidity and heavy dust", "Compliance with local emission regulations", "Automated self-cleaning reduces maintenance", "Supports sustainable biomass combustion"],
      products: ["exo", "exoqal"], apps: ["emission"] },
    { id: "feed", title: "Detect dust problems earlier in animal feed production", short: "Feed mill, Italy", where: "Animal feed producer, Verona, Italy", industry: "Feed",
      img: "case-feed", sq: "case-feed-sq",
      stats: [["Zone 20 / 22", "inside / outside the duct"], ["2 months", "trial with two monitors in parallel"], ["Alarm", "on a simulated bag failure"]],
      challenge: "The producer needed reliable detection of baghouse filter failures before they caused environmental or production problems, in an ATEX Zone 20 duct with Zone 22 outside.",
      solution: "Sintrol and its local partner trialled two monitors in parallel at the Verona plant for two months. A filter bag failure was deliberately simulated.",
      how: "A monitor downstream of the baghouse sees particulate breakthrough directly, where differential pressure only shows pressure across the filter.",
      headline: "Both monitors raised the alarm, and the customer bought more.",
      results: ["Both instruments detected the simulated failure and alarmed", "The signal also tracked changes in the feed being produced", "Additional Sintrol monitors purchased for the plant"],
      products: ["s201", "s203", "s304", "dumopro", "exoqal"], apps: ["brokenbag"],
      table: { head: ["Monitoring location", "What it tells you", "Sintrol solution"], rows: [
        ["Process and extraction ducts", "Changes in particulate levels and process abnormalities", "S203"],
        ["Downstream of filtration", "Filter leaks and filtration performance", "S201, S203, S304"],
        ["Production and handling areas", "Elevated airborne dust and recurring events", "DumoPro"],
        ["Exhaust ducts and stacks", "Particulate emissions", "S304 (Ex)"],
        ["Wet exhaust ducts and stacks", "Particulates in wet, condensing gas", "EXO QAL"]] } }
  ];

  /* ---------- Certifications ---------- */
  const certs = [
    { id: "qal1", name: "QAL1", std: "EN 15267-3", body: "TÜV SÜD", text: "Certified for official emissions measurement under EN 14181, with certified ranges down to 0–7.5 mg/m³.", products: ["s305qal"], docs: ["c-s305qal-qal1", "c-s305qal-probe"] },
    { id: "en15859", name: "EN 15859", std: "Filter dust and leakage monitors", body: "TÜV SÜD", text: "The European standard for filter dust monitors and filter leakage monitors at stationary sources.", products: ["s304qal"], docs: ["c-s304qal-d", "c-s304qal-l"] },
    { id: "mcerts", name: "MCERTS", std: "UK Environment Agency", body: "CSA Group", text: "Product conformity certificate for CEMS, renewed in 2025: traceable accuracy and long-term stability.", products: ["s305qal"], docs: ["c-s305qal-mcerts"] },
    { id: "npl", name: "NPL India", std: "PM-CEMS performance test", body: "National Physical Laboratory", text: "Confirms performance, repeatability and suitability for regulatory emission monitoring in India.", products: ["s305qal"], docs: ["c-s305qal-npl"] },
    { id: "epa", name: "US EPA PS-11", std: "PM CEMS specification", body: "United States", text: "Compliance with the US EPA Performance Specification 11 for particulate matter CEMS.", products: ["s304", "s305qal", "exoqal", "s314"], docs: [] },
    { id: "atex", name: "ATEX and IECEx", std: "Hazardous areas", body: "ExVeritas and others", text: "Ex models for dust Zones 20, 21 and 22; the S314 Ex sensor also for gas Zones 0, 1 and 2.", products: ["s201", "s203", "s303", "s304", "s305qal", "s101", "dumopro", "s314"], docs: ["c-atex-s300", "c-iecex-s300", "c-atex-s100", "c-iecex-s100", "c-atex-dumopro", "c-iecex-dumopro"] },
    { id: "hazloc", name: "HazLoc", std: "US and Canada", body: "MET Laboratories", text: "Approved for hazardous locations in North America: Zone 20, Class II Division 1.", products: ["s201", "s203", "s303", "s304", "s305qal", "dumopro"], docs: ["c-hazloc"] },
    { id: "kcs", name: "Korean KCs", std: "Korea safety certification", body: "Korea", text: "S200 and S300 series and DumoPro Ex hold the Korean KCs certificate.", products: ["s201", "s203", "s303", "s304", "dumopro"], docs: ["c-kcs-s300", "c-kcs-dumopro"] },
    { id: "iso", name: "ISO 9001:2015", std: "Quality management", body: "Kiwa", text: "Sintrol Oy's quality management system is certified to ISO 9001.", products: [], docs: ["iso"] },
    { id: "carbon", name: "Carbon Footprint Calculated", std: "GHG Protocol", body: "Finland Chamber of Commerce", text: "Awarded in 2026 for calculating the footprint of Sintrol's own operations under the GHG Protocol.", products: [], docs: [] }
  ];

  /* ---------- Videos (YouTube). Put an MP4 in assets/video/<id>.mp4 and set file to play it offline. ---------- */
  const videos = [
    { id: "fuWeiSRVqG4", title: "S305QAL dust monitor", group: "Products", product: "s305qal" },
    { id: "eqqG8mRJjsc", title: "Sintrol S-series dust monitors", group: "Products", product: "s304" },
    { id: "-3yDoe6_aU8", title: "DumoPro ambient dust monitor", group: "Products", product: "dumopro" },
    { id: "Q7utbRBGvXg", title: "Vulcan 12CS furnace camera", group: "Products", product: "vulcan" },
    { id: "C5y_X0_V050", title: "Sintrol's dust monitoring portfolio and why dust measurement matters", group: "Webinars" },
    { id: "GQMjeF2unm8", title: "Measuring principle training session", group: "Webinars" },
    { id: "u2omokAxu3A", title: "How to specify the right dust monitor for each application", group: "Webinars" },
    { id: "FxdLxbWJccU", title: "Inline measurements: filtration and stacks", group: "Webinars" },
    { id: "KVB1y7RgjyQ", title: "Continuous ambient dust monitoring in industrial environments", group: "Webinars" },
    { id: "p1rJUPF9QJ0", title: "Dust monitor installation and commissioning", group: "Webinars" },
    { id: "4fiDTzDlLZ8", title: "How to use DustTool: configuration and calibration made easy", group: "Webinars", product: "dusttool" }
  ];
  videos.forEach(v => { v.thumb = "assets/img/yt-" + v.id + ".webp"; v.url = "https://www.youtube.com/watch?v=" + v.id; v.file = v.file || null; });

  /* ---------- Selection tables (from the Emission and Filtration pages) ---------- */
  const matrices = {
    stack: { title: "Which emission monitor?", cols: ["S304 / S304 Ex", "S305QAL", "EXO QAL", "S314 / S314 Ex"], products: ["s304", "s305qal", "exoqal", "s314"], rows: [
      ["Dry stack", "✓", "✓", "–", "✓"], ["Wet, condensing stack", "–", "–", "✓", "–"], ["Ex dust", "✓ Ex", "–", "–", "✓ Ex"], ["Ex gas", "–", "–", "–", "✓ Ex"],
      ["US EPA PS-11", "✓", "✓", "✓", "✓"], ["QAL1 certification", "–", "✓", "pending", "–"], ["Difficult access", "–", "–", "–", "✓"]] },
    filter: { title: "Which filtration monitor?", cols: ["Duct dia.", "mA for filter performance", "Relays for leakage", "Certification", "Auto zero and span"], rows: [
      ["S101 (Ex)", "< 0.7 m", "–", "✓", "Zone 22", "–"], ["S103 (Ex)", "< 0.7 m", "✓", "–", "Zone 22", "–"],
      ["S201 (Ex)", "< 7 m", "–", "✓", "Zone 20, 21, 22", "–"], ["S203 (Ex)", "< 7 m", "✓", "✓", "Zone 20, 21, 22", "–"],
      ["S203-W", "4–10 m", "✓", "✓", "Zone 20, 21, 22", "–"], ["S304 (Ex)", "< 7 m", "✓", "✓", "Zone 20, 21, 22", "✓"],
      ["S314 (Ex)", "< 7 m", "✓", "✓", "Zone 0, 1, 2, 20, 21, 22", "✓"], ["S304QAL-D", "< 7 m", "✓", "–", "QAL1 / EN 15859", "✓"], ["S304QAL-L", "< 7 m", "–", "✓", "QAL1 / EN 15859", "✓"]],
      rowProducts: ["s101", "s101", "s201", "s203", "s203", "s304", "s314", "s304qal", "s304qal"] }
  };

  /* Seven reasons to monitor dust (from "Detect dust before it becomes a problem") */
  const reasons = [
    ["Protect people", "Spot sudden or short-term dust events that periodic exposure measurements miss.", "reason-health"],
    ["Explosion risk", "Early warning of abnormal combustible dust releases and accumulation.", "reason-explosion"],
    ["Equipment", "Find dust entering machinery and cabinets before contamination spreads.", "reason-equipment"],
    ["Fugitive dust", "Know where and when dust escapes, and answer complaints with data.", "reason-nuisance"],
    ["Housekeeping", "Cleaning treats the symptom; monitoring finds the source.", "reason-housekeeping"],
    ["Product loss", "Even a small leak loses a lot of product at high throughput.", "reason-loss"],
    ["Environment", "Measured data, not assumptions, for environmental decisions.", "nature"]
  ];

  /* ---------- Learn more ----------
     The deep-dive loop behind each chapter's "Learn more" button, keyed by scene id (see scenes.js).
     Slide layouts (type):
       callouts { p }                          product picture with animated feature callouts
       features { p, img?, pick?, specs? }     product picture and its features, one at a time
       specs    { p, img? }                    product picture and specification table
       gallery  { items: [{ img, cap, p? }] }  pictures in turn, with a caption list
       compare  { items: [{ p, img?, lines? }] } products side by side
       steps    { img?, p?, steps: [[title, text]...] } numbered steps
       facts    { img }                        company facts beside a photo
       timeline { }                            the company timeline
       cards    { items: [[title, text, img?]...], cols? } a grid of cards
       matrix   { m: "stack" | "filter" }      an animated selection table
       case     { c }                          a reference case: challenge, solution, results
       cases    { ids? }                       reference case tiles (tap to read)
       apps     { }                            application tiles (tap for products)
       certs    { ids? }                       certification tiles (tap for certificates)
       map      { }                            the distributor map
       team     { }                            international sales contacts
       docs     { ids: [...] }                 documents (tap to open)
       articles { ids: [...] }                 Knowledge articles (tap to read)
     Every slide takes kicker, title, lede and dur (seconds; worked out from the content when left out). */
  const deep = {
    intro: { title: "About Sintrol", slides: [
      { type: "facts", img: "technician", kicker: "Sintrol Oy, Helsinki", title: "Finnish dust monitoring, trusted worldwide.",
        lede: "Every Sintrol product is designed by its own in-house R&D team, so it can respond quickly to customer needs and changing regulations." },
      { type: "timeline", kicker: "Measuring Matters since 1975", title: "Fifty years of industrial measurement." },
      { type: "cards", kicker: "Values, mission and vision", title: "What guides us.", cols: 4, items: [
        ["Skilled staff", "We value and support our staff, the foundation of our success."], ["Team spirit", "We encourage, help and respect others, and work together with enthusiasm."],
        ["Customer centricity", "We care for the success and well-being of our customers."], ["Continuous improvement", "We develop our skills and solutions towards a better future."],
        ["Mission", "Solving customers' productivity, safety and environmental challenges with measurement and analysis technologies."],
        ["Vision", "A leading, profitably growing provider of measurement-based Cleantech solutions and services for industry."]] },
      { type: "cards", kicker: "Why choose Sintrol dust monitors?", title: "Built to be fitted and forgotten.", cols: 3, items: [
        ["Certified", "QAL1-certified and Ex-certified instruments available."], ["Low cost of ownership", "No consumables and minimal maintenance."],
        ["No moving parts", "In the measurement, so reliable and durable."], ["One-sided installation", "A single opening and no alignment."],
        ["Steady readings", "Not affected by vibration or temperature."], ["Local display", "Status indication you can read on the floor."]] },
      { type: "docs", ids: ["company", "iso"], kicker: "Company documents" }
    ] },

    principle: { title: "How Inductive Electrification works", slides: [
      { type: "steps", img: "s304", p: "s304", kicker: "Inductive Electrification", title: "From charged particles to mg/m³.", steps: [
        ["Contact", "Particles that touch the insulated probe transfer charge: the DC, triboelectric signal."],
        ["Induction", "Particles that touch or merely pass close to the probe induce an AC signal."],
        ["Filtering", "Advanced algorithms and signal filtering separate the dust signal from noise."],
        ["Reading", "The result is proportional to dust concentration and can be calibrated to mg/m³."]] },
      { type: "cards", kicker: "Why it lasts", title: "No optics, no consumables, no alignment.", cols: 3, items: [
        ["One opening", "The probe goes in from one side of the duct; nothing to align across it."], ["Contamination tolerant", "Field-proven and tolerant of sensor contamination; DumoPro even flags a dirty or wet sensor."],
        ["Wide range", "0.01 mg/m³ detection limit up to several g/m³, linear all the way."], ["Hot and fast", "Up to 300 °C as standard, 700 °C with the high-temperature option; 3 to 40 m/s."],
        ["Big ducts", "Ducts up to 7 m across; the S203-W covers 4 to 10 m."], ["Proven", "Over 20,000 installations in more than 50 countries since 1993."]] },
      { type: "articles", kicker: "Read more", title: "From the Sintrol knowledge library.", ids: ["how-do-triboelectric-dust-monitors-work", "what-is-triboelectric-dust-measurement-technology", "optical-vs-electrostatic-dust-monitoring-for-process-industries", "how-does-an-industrial-dust-monitor-actually-work", "factors-that-affect-dust-monitor-accuracy-in-industrial-settings", "how-do-triboelectric-dust-monitors-perform-in-high-temperature-industrial-processes"] }
    ] },

    autosetup: { title: "Auto Setup and DustTool", slides: [
      { type: "steps", img: "s303", p: "s303", kicker: "Auto Setup", title: "Commissioned in 500 seconds.", steps: [
        ["Install", "Mechanical and electrical installation: one opening in the duct."],
        ["Start Auto Setup", "Press the Auto Setup button in normal process conditions. The LED blinks and a countdown runs."],
        ["Adapt", "The monitor learns the process and sets its measuring range and alarm levels."],
        ["Run", "Green light: normal conditions, with the mA output at 5 % of range."]] },
      { type: "features", p: "dusttool", img: "dusttool", kicker: "DustTool 2, free of charge" },
      { type: "gallery", p: "dusttool", kicker: "DustTool screens", title: "Set up, calibrate and watch live.", items: [
        { img: "dumopro-dusttool", cap: "Parameters for a DumoPro" }, { img: "dusttool", cap: "Live monitor output" }] },
      { type: "docs", ids: ["m-dusttool"], kicker: "DustTool documents", hint: "The DustTool 2 download is on the DustTool page at sintrol.fi/international." }
    ] },

    qal: { title: "S305QAL certified CEMS monitor", slides: [
      { type: "callouts", p: "s305qal" },
      { type: "certs", ids: ["qal1", "mcerts", "npl", "epa", "atex", "hazloc"], kicker: "S305QAL certificates", title: "Certified in Europe, India and North America." },
      { type: "cards", kicker: "Approved for", title: "Plants under these regulations.", cols: 2, items: [
        ["EC Directive 2000/76", "Waste incineration."], ["LCPD 2001/80/EC", "Large combustion plants."], ["IED 2010/75/EU", "Industrial emissions."], ["MCPD 2015/2193", "Medium combustion plants; Germany: 27th, 30th or 44th BImSchV."]] },
      { type: "specs", p: "s305qal" },
      { type: "case", c: "rcc" },
      { type: "docs", ids: ["b-s305qal", "m-s305qal", "c-s305qal-qal1", "c-s305qal-mcerts", "c-s305qal-npl", "doc-s305qal"], kicker: "S305QAL documents" }
    ] },

    stacks: { title: "Dry stacks and wet stacks", slides: [
      { type: "matrix", m: "stack", kicker: "Start with the stack", title: "The stack decides the method.", lede: "In-situ monitors suit dry, non-condensing stacks. Wet scrubbers, wet ESPs and quench systems leave saturated gas and droplets that need an extractive approach." },
      { type: "steps", p: "exoqal", img: "exoqal-flow", kicker: "EXO QAL", title: "Extract, heat, measure, return.", steps: "exoqal" },
      { type: "callouts", p: "exoqal" },
      { type: "specs", p: "exoqal" },
      { type: "case", c: "bagasse" },
      { type: "compare", kicker: "Emission monitors", title: "Four ways to measure the stack.", items: [{ p: "s305qal" }, { p: "s304" }, { p: "exoqal" }, { p: "s314" }] },
      { type: "docs", ids: ["b-exoqal", "b-exo", "m-exo", "b-s304"], kicker: "Emission documents" }
    ] },

    baghouse: { title: "Filter leak detection", slides: [
      { type: "cards", kicker: "Start with what you need to know", title: "Five reasons to measure in the duct.", cols: 3, items: [
        ["Filter leak detection", "A damaged bag, poor seal or leak shows up as particulate breakthrough on the clean side."],
        ["Filtration performance", "Trends reveal gradual deterioration, so maintenance goes where it is needed."],
        ["Process trends", "Changes in material, conditions or equipment appear as changes in dust level."],
        ["ESP performance", "E-SPY gives a reliable relative trend downstream of the precipitator."],
        ["Extraction verification", "Before the filter: extraction works. After it: compliance."],
        ["Why not ΔP alone?", "Differential pressure is vital for the baghouse, but it does not measure the dust getting through."]] },
      { type: "matrix", m: "filter", kicker: "Choose the monitor", title: "From broken-bag alarms to certified filter monitoring." },
      { type: "case", c: "steel" },
      { type: "case", c: "cement" },
      { type: "case", c: "wood" }
    ] },

    lineup: { title: "Filtration monitor lineup", slides: [
      { type: "compare", kicker: "Leak detection", title: "Alarms for small and large ducts.", items: [
        { p: "s101", lines: ["Ducts up to 800 mm", "Relays (S101) or 4–20 mA (S103)", "24 VDC, 1 W"] },
        { p: "s201", lines: ["Ducts up to 7 m", "Two adjustable SPDT relays", "Three-colour status LEDs"] },
        { p: "s203", lines: ["Ducts up to 7 m (S203-W to 10 m)", "4–20 mA trend plus relays", "Zone 20, 21, 22 Ex model"] }] },
      { type: "compare", kicker: "Process and certified monitoring", title: "Display, mass concentration and QAL.", items: [
        { p: "s303", lines: ["Local display and four keys", "4–20 mA, relays, RS-485, USB", "Optional radio link"] },
        { p: "s304", lines: ["Calibrates to mg/m³", "Automatic zero and span checks", "Flow velocity compensation"] },
        { p: "s304qal", lines: ["Certified to EN 15859", "Ranges 0–7.5 to 0–100 mg/m³", "Relays (-L) or 4–20 mA (-D)"] }] },
      { type: "callouts", p: "s101" },
      { type: "callouts", p: "s304qal" },
      { type: "case", c: "flour" },
      { type: "docs", ids: ["b-s101", "b-s201", "b-s304", "b-s304qal", "c-s304qal-l", "c-s304qal-d"], kicker: "Filtration documents" }
    ] },

    split: { title: "S314 split architecture", slides: [
      { type: "callouts", p: "s314" },
      { type: "cards", kicker: "Why split it?", title: "Maintenance at ground level.", cols: 3, items: [
        ["Easier access", "With the electronics in a safe, accessible spot, inspections and maintenance are quick.", "s314-user"],
        ["Safer maintenance", "Less need for scaffolding, lifting equipment and extra access permits.", "hazardous-bg"],
        ["Better visibility", "Read measurements and device health without going to the measuring point.", "technician"]] },
      { type: "features", p: "s314", img: "s314-user", pick: [0, 4, 5, 6] },
      { type: "specs", p: "s314" },
      { type: "docs", ids: ["b-s314"], kicker: "S314 documents" }
    ] },

    esp: { title: "E-SPY for ESPs", slides: [
      { type: "callouts", p: "espy" },
      { type: "cards", kicker: "Why not an opacity monitor?", title: "The problems E-SPY solves.", cols: 2, items: [
        ["Cost", "Optical monitors are expensive to buy, install and maintain."], ["Clean air", "Optics need clean, dry purge air to work."],
        ["Vibration", "ESP vibration fractures and misaligns optics."], ["Lost data", "Poor availability means a costly, unoptimised ESP."]] },
      { type: "features", p: "espy", img: "espy" },
      { type: "case", c: "power" },
      { type: "docs", ids: ["b-espy", "m-espy", "an-power"], kicker: "E-SPY documents" }
    ] },

    ambient: { title: "DumoPro workplace dust monitor", slides: [
      { type: "callouts", p: "dumopro" },
      { type: "cards", kicker: "Seven reasons to monitor dust", title: "Find the dust problem before it gets expensive.", cols: 4, items: "reasons" },
      { type: "features", p: "dumopro", img: "dumopro-ex" },
      { type: "case", c: "metal" },
      { type: "gallery", p: "dumopro", kicker: "Poultry houses", title: "When do dust levels peak?", lede: "Dust changes with feeding, litter handling, bird activity, catching and clean-out. Continuous data shows the peaks that spot checks miss.",
        items: [{ img: "poultry-house", cap: "Bird activity and litter" }, { img: "poultry-laptop", cap: "Compare houses and cycles" }, { img: "poultry-farm", cap: "Evaluate ventilation changes" }] },
      { type: "specs", p: "dumopro" },
      { type: "docs", ids: ["b-dumopro", "m-dumopro", "c-atex-dumopro", "c-iecex-dumopro", "an-metal", "an-sugar"], kicker: "DumoPro documents" }
    ] },

    tunnel: { title: "Grain tunnel case", slides: [
      { type: "case", c: "grain" },
      { type: "case", c: "sugar" },
      { type: "articles", kicker: "Read more", title: "Combustible dust and safety.", ids: ["how-continuous-dust-monitoring-detects-explosion-risk-in-real-time", "the-importance-of-dust-measurement-in-silos-for-safety-and-efficiency", "dust-dangers-monitoring-for-unexpected-events", "why-is-real-time-dust-monitoring-critical-for-workplace-safety-in-2026"] }
    ] },

    cloud: { title: "DustCloud and DustTool", slides: [
      { type: "steps", p: "dustcloud", img: "dustcloud-flow", kicker: "How DustCloud works", title: "From the monitor to your phone.", steps: "dustcloud" },
      { type: "gallery", p: "dustcloud", kicker: "DustCloud views", title: "Data, alarms and device status in one service.", items: [
        { img: "dustcloud-views", cap: "Trends, averages and alarm history" }, { img: "dustcloud-multisite", cap: "Map and device list across sites" }, { img: "dustcloud-hero", cap: "Every location at a glance" }] },
      { type: "features", p: "dustcloud", img: "dustcloud-views" },
      { type: "specs", p: "dustcloud", img: "dustcloud-flow" },
      { type: "features", p: "dusttool", img: "dusttool" },
      { type: "docs", ids: ["b-dustcloud", "m-dusttool"], kicker: "Software documents" }
    ] },

    apps: { title: "Applications", slides: [
      { type: "apps", kicker: "Application finder", title: "What do you need to know?", lede: "Tap an application for the monitors and cases behind it." },
      { type: "cards", kicker: "Where to measure", title: "Monitor dust where it matters.", cols: 4, items: [
        ["Downstream of baghouses", "Clean-air outlets and common outlet ducts."], ["Process ducts", "Dust trends that reflect operating conditions."],
        ["After ESPs", "Relative trends for precipitator control."], ["Pneumatic conveying", "Leaks, build-up and blockages."],
        ["Stacks", "Particulate emissions, dry or wet."], ["Conveyors and transfers", "Airborne dust from material handling."],
        ["Silo skirts and loading", "Spills and unloading blockages."], ["Unattended areas", "Tunnels, roof spaces and hazardous zones."]] },
      { type: "case", c: "feed" }
    ] },

    results: { title: "Reference cases", slides: [
      { type: "cases", kicker: "Reference cases", title: "Eleven plants, eleven problems solved.", lede: "Tap a case to read it." },
      { type: "case", c: "wood" },
      { type: "case", c: "metal" },
      { type: "case", c: "cement" },
      { type: "case", c: "power" }
    ] },

    certs: { title: "Certifications", slides: [
      { type: "certs", kicker: "Certified performance", title: "Data that is reliable, traceable and compliant.", lede: "Tap a certification to see the certificates." },
      { type: "docs", ids: ["c-s305qal-qal1", "c-s304qal-d", "c-s305qal-mcerts", "c-s305qal-npl", "c-atex-s300", "c-hazloc", "iso"], kicker: "Certificates" }
    ] },

    network: { title: "Global network", slides: [
      { type: "map", kicker: "Find your local distributor", title: "Local partners in 40 countries.", lede: "Tap a country to see its Sintrol partners." },
      { type: "team", kicker: "International sales", title: "Talk to the dust monitoring team." },
      { type: "steps", img: "team-monitors", kicker: "Become a Sintrol distributor", title: "A proven product line for your portfolio.", steps: [
        ["Apply", "Tell Sintrol about your business with the distributor inquiry form."],
        ["Discuss", "The team reviews your application and arranges a discussion."],
        ["Train and sell", "Full training, marketing support, exclusive pricing and priority support."]] },
      { type: "gallery", kicker: "Partner training", title: "EXO commissioning and service training.", lede: "At Sintrol headquarters in Helsinki, up to six participants per session. Next session: 12 to 14 January 2027.",
        items: [{ img: "exo-training", cap: "Hands-on EXO training in Helsinki" }, { img: "webinar", cap: "Partner webinars on YouTube" }] }
    ] },

    furnace: { title: "Vulcan furnace cameras", slides: [
      { type: "features", p: "vulcan", img: "vulcan-thermal" },
      { type: "gallery", p: "vulcan", kicker: "Inside the furnace", title: "Video and temperature, in real time.", items: [
        { img: "vulcan-thermal", cap: "Thermal map of a recovery boiler" }, { img: "vulcan-bw", cap: "The same view in video" }, { img: "vulcan-limekiln", cap: "Lime kiln analysis" }, { img: "vulcan-kiln", cap: "Kiln flame" }] },
      { type: "specs", p: "vulcan", img: "vulcan12mt" },
      { type: "docs", ids: ["b-vulcan"], kicker: "Vulcan documents" }
    ] }
  };

  return { event, company, team, families, products: P, apps, industries, cases, certs, videos, matrices, reasons, docs: D, deep };
})();
