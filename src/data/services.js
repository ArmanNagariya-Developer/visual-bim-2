/**
 * Visual BIM services.
 * `viz` maps to a mini-visualisation variant rendered by <ServiceViz />.
 */
export const services = [
  {
    id: 'scan-to-bim',
    num: '01',
    title: 'Scan to BIM',
    tag: 'Point Cloud → Revit BIM',
    desc: 'Point-cloud data converted into accurate, data-rich Revit models of existing conditions.',
    viz: 'pointtobim',
    bullets: ['Registered point clouds', 'Revit 2021+', 'LOD 200–350'],
  },
  {
    id: 'scan-to-cad',
    num: '02',
    title: 'Scan to CAD',
    tag: 'Laser Scan → CAD Drawing',
    desc: 'Laser scan data translated into precise, layered 2D CAD drawings.',
    viz: 'scantocad',
    bullets: ['Plans · Sections · Elevations', 'Layered .DWG', ' millimetre accuracy'],
  },
  {
    id: 'pdf-to-bim',
    num: '03',
    title: 'PDF to BIM',
    tag: 'PDF → Digital BIM',
    desc: 'Legacy PDF drawings rebuilt as intelligent, parametric BIM models.',
    viz: 'pdftobim',
    bullets: ['Raster & vector PDF', 'Parametric families', 'Model in context'],
  },
  {
    id: 'cad-to-bim',
    num: '04',
    title: 'CAD to BIM',
    tag: '2D CAD → 3D BIM',
    desc: '2D CAD upgraded into coordinated 3D models with full building intelligence.',
    viz: 'cadtobim',
    bullets: ['2D plan interpretation', 'Coordinated 3D model', 'Clash-ready'],
  },
  {
    id: 'revit-modeling',
    num: '05',
    title: 'Revit Modeling',
    tag: 'LOD 100 → LOD 500',
    desc: 'Parametric Revit models and families delivered from LOD 100 to LOD 500.',
    viz: 'lod',
    bullets: ['Revit families', 'LOD 100–500', 'Template-driven'],
  },
  {
    id: 'bim-3d-modeling',
    num: '06',
    title: '3D BIM Modeling',
    tag: 'Arch + Struct + MEP',
    desc: 'Detailed, clash-free 3D models across architectural, structural, and MEP disciplines.',
    viz: 'layers',
    bullets: ['Multi-discipline', 'Clash detection', 'Federated model'],
  },
  {
    id: 'as-built-modeling',
    num: '07',
    title: 'As-Built Modeling',
    tag: 'Site → Verified Model',
    desc: 'Verified as-built models that reflect true site conditions for handover and facility management.',
    viz: 'asbuilt',
    bullets: ['Site verification', 'Handover & FM', 'Digital twin ready'],
  },
];
