/**
 * Project portfolio.
 * Figures and locations are illustrative placeholders — no real client
 * statistics are claimed. Projects with a photo in `src/assets` use it via
 * the `image` field; the rest fall back to procedurally generated visuals
 * (see ProjectVisual.jsx) from `scene` + `seed`.
 */
import project1 from '../assets/1.jpeg';
import project2 from '../assets/2.jpeg';

export const projectCategories = ['All', 'Residential', 'Commercial', 'Public Buildings'];

export const projects = [
  {
    id: 'p1',
    title: 'Harbourview Residences',
    category: 'Residential',
    type: 'High-Rise Residential',
    year: '2025',
    location: 'Port District',
    services: ['Scan to BIM', 'Revit Modeling', 'As-Built Modeling'],
    lod: 'LOD 300',
    scene: 'tower',
    seed: 11,
    desc: 'A 14-storey residential tower modelled from registered laser scans of the existing structure, delivering coordinated as-built documentation for the facade and MEP retrofit.',
  },
  {
    id: 'p2',
    title: 'Meridian Court Offices',
    category: 'Commercial',
    type: 'Commercial Office',
    year: '2025',
    location: 'Central Business District',
    services: ['CAD to BIM', '3D BIM Modeling', 'Revit Modeling'],
    lod: 'LOD 350',
    scene: 'complex',
    seed: 24,
    desc: 'Legacy 2D CAD of a nine-storey office complex upgraded into a fully coordinated multi-discipline model with clash detection across architecture, structure, and MEP.',
  },
  {
    id: 'p3',
    title: 'Northgate Civic Library',
    category: 'Public Buildings',
    type: 'Civic / Cultural',
    year: '2024',
    location: 'Northgate Precinct',
    services: ['Scan to BIM', 'Scan to CAD', 'As-Built Modeling'],
    lod: 'LOD 300',
    scene: 'public',
    seed: 37,
    desc: 'Heritage civic structure captured with terrestrial laser scanning and rebuilt as an intelligent as-built model to support renovation and facilities management.',
  },
  {
    id: 'p10',
    title: 'Vale Mill Structure Scan',
    category: 'Commercial',
    type: 'Heritage Industrial / Scan to BIM',
    year: '2025',
    location: 'Mill Quarter',
    services: ['Scan to BIM', 'As-Built Modeling'],
    lod: 'LOD 300',
    scene: 'complex',
    seed: 101,
    image: project1,
    desc: 'High-density laser scan of a two-storey mill structure with exposed roof framing, registered into a clean point cloud to support condition assessment and redevelopment design.',
  },
  {
    id: 'p11',
    title: 'Cedar Ridge Residential Complex',
    category: 'Residential',
    type: 'Low-Rise Residential',
    year: '2025',
    location: 'Cedar Ridge',
    services: ['Revit Modeling', '3D BIM Modeling'],
    lod: 'LOD 350',
    scene: 'tower',
    seed: 112,
    image: project2,
    desc: 'Interconnected low-rise residential complex modelled parametrically in Revit, with pitched-roof wings, apartment layouts, and coordinated openings for documentation.',
  },
];
