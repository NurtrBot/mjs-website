/**
 * BigCommerce → Site Category Mapping
 *
 * Maps every BigCommerce category ID to one of the site's canonical category
 * slugs. Children inherit the mapping of their top-level parent unless
 * explicitly overridden.
 *
 * Generated from the live BC catalog on 2026-04-02.
 */

// ---------------------------------------------------------------------------
// 1. Slug → display-name lookup
// ---------------------------------------------------------------------------
export const SITE_CATEGORY_NAMES: Record<string, string> = {
  "paper-products": "Paper Products",
  "cleaning-chemicals": "Cleaning Chemicals",
  "trash-liners": "Trash Liners & Bags",
  "gloves-safety": "Gloves & Safety",
  "packaging-film": "Packaging & Film",
  "breakroom": "Breakroom & Food Service",
  "equipment": "Equipment",
  "floor-care": "Floor Care",
  "car-detailing": "Car Detailing",
};

// ---------------------------------------------------------------------------
// 2. BigCommerce category ID → site slug
// ---------------------------------------------------------------------------
export const BC_CATEGORY_MAP: Record<number, string> = {
  // ── Paper Products (1103) ──────────────────────────────────────────────
  1103: "paper-products",
  1104: "paper-products", // ROLL TOWEL
  1107: "paper-products", // FOLDED TOWELS
  1108: "paper-products", // STANDARD TOILET TISSUE ROLLS
  1109: "paper-products", // JUMBO ROLLS
  1110: "paper-products", // CORELESS TOILET TISSUE
  1111: "paper-products", // FACIAL TISSUE
  1112: "paper-products", // TOILET SEAT COVERS
  1321: "paper-products", // FEMININE HYGIENE PRODUCTS (under paper)
  1322: "paper-products", // EXAM & BABY CHANGING TABLE PAPER
  1324: "paper-products", // KITCHEN ROLL TOWELS
  1336: "paper-products", // COPIER PAPER
  1341: "paper-products", // WIPERS
  1345: "paper-products", // CENTER PULL TOWELS
  1348: "paper-products", // DISPOSABLE WIPERS
  // Towels & Tissues top-level (1492)
  1492: "paper-products",
  1493: "paper-products", // Towels & Wipes
  // Essendant Towels, Tissues & Dispensers (1444)
  1444: "paper-products",

  // ── Cleaning Chemicals (1132) ──────────────────────────────────────────
  1132: "cleaning-chemicals",
  1133: "cleaning-chemicals", // JANITORS FINEST CHEMICALS
  1134: "cleaning-chemicals", // HAND SOAPS
  1135: "cleaning-chemicals", // HAND SANITIZER
  1136: "cleaning-chemicals", // DISINFECTING WIPES
  1137: "cleaning-chemicals", // GLASS CLEANER
  1138: "cleaning-chemicals", // DEGREASERS
  1139: "cleaning-chemicals", // TOILET & BATHROOM
  1140: "cleaning-chemicals", // FLOOR STRIPPER
  1141: "cleaning-chemicals", // FLOOR SEALER
  1142: "cleaning-chemicals", // FLOOR FINISH
  1143: "cleaning-chemicals", // FLOOR CLEANERS
  1144: "cleaning-chemicals", // CARPET SHAMPOO
  1145: "cleaning-chemicals", // CARPET SPOTTERS
  1146: "cleaning-chemicals", // ODOR CONTROL
  1147: "cleaning-chemicals", // KITCHEN & LAUNDRY
  1148: "cleaning-chemicals", // ALL PURPOSE CLEANERS
  1149: "cleaning-chemicals", // POLISHES
  1150: "cleaning-chemicals", // DISINFECTANTS
  1151: "cleaning-chemicals", // DRAIN CLEANERS & MAINTAINERS
  1327: "cleaning-chemicals", // AEROSOL PRODUCTS
  1328: "cleaning-chemicals", // AEROSOL CLEANERS
  1335: "cleaning-chemicals", // AEROSOLS
  1351: "cleaning-chemicals", // BULK AIR FRESHENER
  1352: "cleaning-chemicals", // STONE PRO PRODUCTS
  1359: "cleaning-chemicals", // LA'S TOTALLY AWESOME PRODUCTS
  1730: "car-detailing",     // WONDER WAFERS AUTO DETAIL AIR FRESHENERS
  // Essendant chemical sub-categories
  1448: "cleaning-chemicals", // Cleaners & Detergents
  1450: "cleaning-chemicals", // Laundry Products
  1451: "cleaning-chemicals", // Hand Sanitizers & Dispensers
  1452: "cleaning-chemicals", // Odor Control
  1465: "cleaning-chemicals", // Restroom Cleaners & Accessories
  // Industrial chemicals
  1536: "cleaning-chemicals", // Chemicals, Lubricants & Paints

  // ── Bathroom Deodorizers (1329) → cleaning-chemicals ───────────────────
  1329: "cleaning-chemicals",
  1124: "cleaning-chemicals", // HANDHELD AIR FRESHENERS AEROSOL
  1125: "cleaning-chemicals", // URINAL SCREENS
  1126: "cleaning-chemicals", // BOWL CLIPS
  1127: "cleaning-chemicals", // URINAL AND TOILET MATS
  1131: "cleaning-chemicals", // AUTOMATIC AIR FRESHENERS

  // ── Personal Hygiene / Soaps (1530) → cleaning-chemicals ───────────────
  1530: "cleaning-chemicals",
  1531: "cleaning-chemicals", // Personal Soaps
  // Essendant personal hygiene
  1476: "cleaning-chemicals", // Personal Hygiene Products (under J&S)

  // ── Trash Liners (1156) & Bags & Liners (1606) ────────────────────────
  1156: "trash-liners",
  1157: "trash-liners", // HIGH DENSITY
  1158: "trash-liners", // LOW DENSITY
  1349: "trash-liners", // DRAWSTRING BAGS
  1350: "trash-liners", // T-SHIRT BAGS
  1562: "trash-liners", // Black (low density child)
  1563: "trash-liners", // Clear
  1564: "trash-liners", // Compostable
  1565: "trash-liners", // Colored
  1606: "trash-liners", // Bags & Liners (top-level)
  1607: "trash-liners", // Bags (child of 1606)
  // Essendant trash bags
  1471: "trash-liners", // Trash Bags, Can Liners & Dispensers

  // ── Gloves & Safety ────────────────────────────────────────────────────
  // Disposable Gloves (1200)
  1200: "gloves-safety",
  1201: "gloves-safety", // BLUE NITRILE GLOVES
  1202: "gloves-safety", // BLACK NITRILE GLOVES
  1203: "gloves-safety", // LATEX GLOVES
  1204: "gloves-safety", // VINYL GLOVES
  1205: "gloves-safety", // GLOVE DISPENSERS
  1206: "gloves-safety", // ACRYLIC GLOVE DISPENSER
  1343: "gloves-safety", // HYBRID STRETCH DISPOSABLE GLOVES
  1588: "gloves-safety", // NITRILE GLOVES
  1589: "gloves-safety", // DIAMOND GRIP 8 MIL NITRILE GLOVES
  // Safety (1334) top-level
  1334: "gloves-safety",
  1207: "gloves-safety", // ARM PROTECTION
  1208: "gloves-safety", // POLY SLEEVES
  1209: "gloves-safety", // APRONS
  1210: "gloves-safety", // POLY APRONS
  1211: "gloves-safety", // HAIR PROTECTION
  1212: "gloves-safety", // BEARD COVERS
  1213: "gloves-safety", // BOUFFANT CAPS
  1214: "gloves-safety", // EAR LOOP FACE MASKS
  1215: "gloves-safety", // FACE PROTECTION
  1216: "gloves-safety", // FACE MASKS
  1217: "gloves-safety", // SHOE PROTECTION
  1218: "gloves-safety", // SHOE COVERS
  1219: "gloves-safety", // DISPOSABLE WEAR
  1220: "gloves-safety", // LAB COATS
  1279: "gloves-safety", // FIRST AID REFILLS
  1280: "gloves-safety", // CABINET REFILLS
  1302: "gloves-safety", // SAFETY SUPPLIES
  1303: "gloves-safety", // BACK SUPPORT BELTS
  1304: "gloves-safety", // RAIN WEAR (child of 1303)
  1305: "gloves-safety", // DUST & FACE MASKS (child of 1304)
  1306: "gloves-safety", // INDUSTRIAL GLOVES (child of 1305)
  1307: "gloves-safety", // EAR PLUGS
  1308: "gloves-safety", // EYE WEAR
  1309: "gloves-safety", // DUST MASKS
  1310: "gloves-safety", // EAR LUGS
  1311: "gloves-safety", // INDUSTRIAL GLOVES (child of 1302)
  1312: "gloves-safety", // RAIN WEAR (child of 1302)
  // Safety & Security (1558)
  1558: "gloves-safety",
  1559: "gloves-safety", // Gloves
  // Essendant Safety & Security (under J&S 1432)
  1455: "gloves-safety",
  1482: "gloves-safety", // Gloves & Glove Dispensers
  // Essendant First Aid
  1433: "gloves-safety", // First Aid & Health Supplies
  // Safety & Security (under Office 1427)
  1544: "gloves-safety",
  // Industrial safety
  1591: "gloves-safety", // Safety & Security (under Industrial)

  // ── Packaging & Film (1221) ────────────────────────────────────────────
  1221: "packaging-film",
  1222: "packaging-film", // HAND FILM
  1223: "packaging-film", // BUNDLING FILM
  1224: "packaging-film", // HAND HELD TAPE
  1225: "packaging-film", // MACHINE TAPE
  1226: "packaging-film", // PAPER TAPE
  1227: "packaging-film", // PACKING SLIP ENVELOPES
  1230: "packaging-film", // TAPE GUN DISPENSERS
  1231: "packaging-film", // STYROFOAM PACKING PEANUTS
  1232: "packaging-film", // STEEL STRAPPING
  1233: "packaging-film", // BUBBLE WRAP
  1313: "packaging-film", // COLORED FILMS
  1550: "packaging-film", // REGULAR (hand film child)
  1551: "packaging-film", // CLEAR STRETCH FILM
  1592: "packaging-film", // CABLE ZIP TIES
  1643: "packaging-film", // Poly-bags
  1644: "packaging-film", // Flat Poly Bags
  1645: "packaging-film", // Gusseted Poly Bags
  1646: "packaging-film", // Reclosable Bags
  1647: "packaging-film", // Auto Fill Bags
  1648: "packaging-film", // Suffocation Warning Bags
  1649: "packaging-film", // Polypropylene Bags
  1650: "packaging-film", // Pink Anti-Static Bags
  1651: "packaging-film", // Static Shielding Bags
  1652: "packaging-film", // Produce-Newspaper-Doorknob Bags
  1653: "packaging-film", // High Density Merchandise Bags
  1654: "packaging-film", // Poly Tarps
  1655: "packaging-film", // Furniture & Mattress Cover
  1656: "packaging-film", // Bin Liners & Pallet Cover
  1657: "packaging-film", // Poly Tubing
  1658: "packaging-film", // 1 Mil Flat Poly Bags
  1659: "packaging-film", // 1.25 Mil Flat Poly Bags
  1660: "packaging-film", // 1.5 Mil Flat Poly Bag
  1661: "packaging-film", // 2 Mil Flat Poly Bags
  1662: "packaging-film", // 3 Mil Flat Poly Bags
  1663: "packaging-film", // 4 Mil Flat Poly Bags
  1664: "packaging-film", // 6 Mil Flat Poly Bags
  1665: "packaging-film", // 0.75 Mil Gusseted Poly Bags
  1666: "packaging-film", // 1 Mil Gusseted Poly Bags
  1667: "packaging-film", // 1.25 Mil Gusseted Poly Bags
  1668: "packaging-film", // 1.5 Gusseted Poly Bags
  1669: "packaging-film", // 2 Mil Gusseted Poly Bags
  1670: "packaging-film", // 2 Mil Reclosable Poly Bags
  1671: "packaging-film", // Standard Auto Fill Bags
  1672: "packaging-film", // Heavy Auto Fill Bags
  1673: "packaging-film", // Polypropylene Flat Bags
  1674: "packaging-film", // Polypropylene Gusseted Bags
  1675: "packaging-film", // Polypropylene Ziplock Bags with Hang Hole
  1676: "packaging-film", // 2 Mil Anti-Static Flat Bags
  1677: "packaging-film", // 4 Mil Anti-Static Flat Bags
  1678: "packaging-film", // 6 Mil Anti-Static Flat Bags
  1679: "packaging-film", // 4 Mil Anti-Static Zip Lock Bags
  1680: "packaging-film", // T-Shirt Bags (merchandise)
  1681: "packaging-film", // Specialty White High Density
  1682: "packaging-film", // Low Density Produce Rolls
  1683: "packaging-film", // High Density Produce Rolls
  1684: "packaging-film", // Doorknob Bags - Low Density
  1685: "packaging-film", // Newspaper Bags - Low Density
  1686: "packaging-film", // 1 Mil Poly Tarps
  1687: "packaging-film", // 2 Mil Poly Tarps
  1688: "packaging-film", // 4 Mil Poly Tarps
  1689: "packaging-film", // 6 Mil Poly Tarps
  1690: "packaging-film", // Furniture Covers
  1691: "packaging-film", // Mattress Bags
  1692: "packaging-film", // Pallet Covers and Bin Liners
  1693: "packaging-film", // Poly Tubing (child)
  1694: "packaging-film", // 4 Mil Reclosable Poly Bags
  1695: "packaging-film", // 2 Mil Reclosable Poly Bags with Hang Hole
  1696: "packaging-film", // 4 Mil Reclosable Poly Bags with Hang Hole
  // Essendant Pack & Ship
  1445: "packaging-film",

  // ── Breakroom & Food Service ───────────────────────────────────────────
  // Cups (1239)
  1239: "breakroom",
  1240: "breakroom", // FOAM CUPS
  1241: "breakroom", // PLASTIC CUPS
  1242: "breakroom", // PAPER CUPS
  // Breakroom (1243)
  1243: "breakroom",
  1244: "breakroom", // PLATES
  1245: "breakroom", // BOWLS
  1246: "breakroom", // UTENSILS MEDIUM WEIGHT
  1247: "breakroom", // UTENSILS HEAVY WEIGHT
  1248: "breakroom", // COFFEE AND SUPPLIES
  1278: "breakroom", // NAPKINS
  1337: "breakroom", // CUPS (under breakroom)
  1439: "breakroom", // FOAM CUPS (under 1337)
  1440: "breakroom", // PLASTIC CUPS (under 1337)
  1441: "breakroom", // PAPER CUPS (under 1337)
  1729: "breakroom", // Food Storage Bags (under breakroom)
  // Food Service (1577)
  1577: "breakroom",
  1578: "breakroom", // Cups & Lids
  1579: "breakroom", // Coffee
  1580: "breakroom", // Cutlery
  1581: "breakroom", // Bowls & Plates
  1582: "breakroom", // Breakroom Supplies
  1583: "breakroom", // Beverages & Beverage Dispensers
  1584: "breakroom", // Food
  1585: "breakroom", // Food Trays, Containers & Lids
  1586: "breakroom", // Kitchen Supplies
  1587: "breakroom", // Napkins, Dispensers & Towelettes
  1590: "breakroom", // Appliances
  1593: "breakroom", // Pizza Supplies
  1600: "breakroom", // Bags (food service)
  1604: "breakroom", // Food Wraps
  1605: "breakroom", // Food Warming
  1608: "breakroom", // Apparel (food service)
  1719: "breakroom", // Warewashing
  1724: "breakroom", // Glassware
  // General > Food Service (1434 > 1429)
  1434: "breakroom",
  1429: "breakroom", // Food Service
  1424: "breakroom", // Flat Bags (food)
  1425: "breakroom", // 2.0 Mil
  1430: "breakroom", // Table Service
  1435: "breakroom", // General (child)
  1462: "breakroom", // Appliances (Essendant food)
  1463: "breakroom", // Food
  1473: "breakroom", // Coffee
  1474: "breakroom", // Breakroom Supplies
  1484: "breakroom", // Beverages & Beverage Dispensers
  1485: "breakroom", // Food Trays, Containers & Lids
  1494: "breakroom", // Cups & Lids
  1499: "breakroom", // Kitchen Supplies
  1519: "breakroom", // Cutlery
  1523: "breakroom", // Bowls & Plates
  1529: "breakroom", // Pizza Supplies
  1541: "breakroom", // Bags (food)
  1542: "breakroom", // Food Wraps
  1543: "breakroom", // Napkins, Dispensers & Towelettes
  1572: "breakroom", // Party Decorations
  // Facilities Maintenance (1573) food sub-cats
  1573: "breakroom",
  1574: "breakroom", // Food Trays, Containers & Lids
  1575: "breakroom", // Kitchen Supplies
  1576: "breakroom", // Bags

  // ── Equipment (1630) & Dispensers (1092) ───────────────────────────────
  1630: "equipment",
  1631: "equipment", // Floor Machines
  1632: "equipment", // High Speed Buffers
  1633: "equipment", // Carpet Extractors
  1634: "equipment", // Carpet Spotters
  1635: "equipment", // Restroom Cleaning Machines
  1636: "equipment", // Upright Vacuums
  1637: "equipment", // Backpack Vacuums
  1638: "equipment", // Wet and Dry Vacuums
  1640: "equipment", // Air Movers
  1728: "equipment", // Backpack Vacuum Bags
  // Dispensers (1092)
  1092: "equipment",
  1093: "equipment", // HAND SOAP DISPENSERS
  1094: "equipment", // AUTOMATIC LIQUID SOAP DISPENSERS
  1095: "equipment", // AUTOMATIC FOAM SOAP DISPENSERS
  1096: "equipment", // MANUAL FOAM SOAP DISPENSERS
  1097: "equipment", // TOILET SEAT COVER DISPENSERS
  1098: "equipment", // TOILET TISSUE DISPENSERS
  1099: "equipment", // JUMBO ROLL TISSUE DISPENSERS
  1101: "equipment", // ROLL TOWEL DISPENSERS
  1102: "equipment", // FOLDED TOWEL DISPENSERS
  1346: "equipment", // FEMININE HYGIENE DISPENSERS
  // Essendant Soaps & Dispensers
  1437: "equipment",
  // Essendant Mops & Equipment
  1479: "equipment",

  // ── Janitorial Supplies (1333) — sub-categories map to various slugs ──
  1333: "equipment",
  // Trash Management (1325)
  1325: "equipment",
  1163: "equipment", // TRASH CANS
  1164: "equipment", // OFFICE AND BATHROOM
  1165: "equipment", // BATHROOM AND KITCHEN
  1166: "equipment", // WAREHOUSE AND TRASH COLLECTION
  1167: "equipment", // TRASH CAN ACCESSORIES
  1168: "equipment", // DOLLIES
  1169: "equipment", // DUMP TRUCKS
  1170: "equipment", // TRASH CAN ACCESSORIES (duplicate)
  1171: "equipment", // SPECIAL EVENT TRASH CANS
  1172: "equipment", // SPECIAL EVENT TRASH CAN LIDS
  // Waste Receptacles (1717)
  1717: "equipment",
  1718: "equipment", // Waste Receptacles
  1478: "equipment", // Waste Receptacles & Lids (Essendant)
  // Facilities Maintenance (1326)
  1326: "equipment",
  1159: "equipment", // BROOMS & SWEEPING
  1160: "equipment", // BROOMS
  1161: "equipment", // PUSH BROOMS
  1162: "equipment", // DUST PANS
  1185: "equipment", // MOP HEADS
  1186: "equipment", // COTTON MOP HEADS
  1187: "equipment", // RAYON MOP HEADS
  1188: "equipment", // LAUNDRY MOP HEADS
  1189: "equipment", // MOP HANDLES
  1190: "equipment", // FIBERGLASS
  1191: "equipment", // WOOD
  1192: "equipment", // MOPPING EQUIPMENT
  1193: "equipment", // JANITOR CART
  1194: "equipment", // MOP BUCKETS
  1234: "equipment", // SPRAYERS & BOTTLES
  1235: "equipment", // BOTTLES & TRIGGER 3 PACK
  1236: "equipment", // PLASTIC BOTTLES
  1237: "equipment", // TRIGGER SPRAYERS
  1238: "equipment", // PUMP SPRAYERS
  1259: "equipment", // PAD DRIVERS & BRUSHES
  1260: "equipment", // PAD DRIVERS
  1261: "equipment", // CLUTCH PLATES
  1262: "equipment", // POLYPROPYLENE BRUSHES
  1263: "equipment", // TAMPICO BRUSHES
  1264: "equipment", // NYLON BRUSHES
  1338: "equipment", // UTILITY PADS & HOLDERS
  1339: "equipment", // BROOM HANDLES
  // Sweeping Compounds & Absorbents (1152)
  1152: "equipment",
  1153: "equipment", // SWEEPING COMPOUNDS
  1154: "equipment", // ABSORBENTS
  1155: "equipment", // ASH TRAY SAND
  // Window Equipment (1281)
  1281: "equipment",
  1282: "equipment", // SQUEEGE REFILLS
  1283: "equipment", // CHANNEL REPLACEMENTS WITH RUBBER
  1284: "equipment", // SUPER CHANNELS
  1285: "equipment", // SQUEEGE HANDLES
  1286: "equipment", // COMPLETE SQUEEGES
  1287: "equipment", // ALL PURPOSE SQUEEGE COMPLETE
  1288: "equipment", // BACKFLIPS
  1289: "equipment", // GOLDEN GLOVE WASHERS COMPLETE
  1290: "equipment", // GOLDEN GLOVE WASHER REPLACEMENT SLEEVE
  1291: "equipment", // WINDOW BUCKETS
  1292: "equipment", // SCRAPERS
  1293: "equipment", // FLOOR SCRAPERS
  1294: "equipment", // REPLACEMENT BLADES
  1295: "equipment", // EXTENSION POLES
  1298: "equipment", // Tools
  1299: "equipment", // CHEMICAL (window)
  1300: "equipment", // MICROFIBER ADVANCED SLEEVES
  // Microfiber (1121)
  1121: "equipment",
  1122: "equipment", // SMART RAGS MICROFIBER TOWELS
  1123: "equipment", // MICROFIBER TOWELS
  // Rags & Brushes (1330)
  1330: "equipment",
  1331: "equipment", // RAGS & DUSTERS
  1119: "equipment", // CLOTH RAGS
  1120: "equipment", // RAGS
  1332: "equipment", // BRUSHES
  1198: "equipment", // TOILET BOWL SCROURING
  1199: "equipment", // PUMICE STICKS
  // Essendant Cleaning Tools & Brooms
  1475: "equipment", // Cleaning Tools
  1489: "equipment", // Brooms, Brushes & Dusters
  1510: "equipment", // Air Cleaners, Fans, Heaters & Humidifiers
  1528: "equipment", // Trucks, Carts & Dollies
  1534: "equipment", // Matting
  1560: "equipment", // Hardware, Tools & Accessories
  1570: "equipment", // Facility Maintenance

  // ── Dusters (1173) → equipment ─────────────────────────────────────────
  1173: "equipment",
  1175: "equipment", // EXTENDABLE DUSTERS
  1316: "equipment", // MICROFIBER DUSTERS
  1317: "equipment", // HIGH REACH DUSTERS
  1318: "equipment", // LAMBSWOOL DUSTERS
  1319: "equipment", // POLY DUSTERS
  1320: "equipment", // OSTRICH FEATHER DUSTERS

  // ── Dust Mopping (1177) → equipment ────────────────────────────────────
  1177: "equipment",
  1178: "equipment", // DUST MOP REFILL HEADS
  1179: "equipment", // DUST MOP FRAMES
  1180: "equipment", // DUST MOP HANDLES

  // ── Wet Mopping (1181) → equipment ─────────────────────────────────────
  1181: "equipment",
  1182: "equipment", // MICROFIBER FLAT MOPS
  1183: "equipment", // MICROFIBER FLAT MOP SYSTEM COMPLETE
  1184: "equipment", // MICROFIBER WET MOPPING SYSTEM

  // ── Hand Pads & Brushes (1195) → equipment ─────────────────────────────
  1195: "equipment",
  1196: "equipment", // HAND PADS
  1197: "equipment", // TOILET BOWL BRUSHES

  // ── Floor Care ─────────────────────────────────────────────────────────
  // Floor Pads (1277, under Facilities Maintenance)
  1277: "floor-care",
  // Carpet Pads (1272)
  1272: "floor-care",
  1273: "floor-care", // BONNET W
  1274: "floor-care", // SCRUBBERS
  1275: "floor-care", // BONNET
  // Essendant Floor & Carpet Care
  1472: "floor-care",

  // ── Feminine Products (1114) → paper-products ──────────────────────────
  1114: "paper-products",
  1115: "paper-products", // HYGENE
  1118: "paper-products", // DISPENSERS (feminine)

  // ── Restroom Signs (1296) → equipment ──────────────────────────────────
  1296: "equipment",

  // ── Batteries (1249) → breakroom ───────────────────────────────────────
  1249: "breakroom",
  1250: "breakroom", // BULK BATTERIES
  1453: "breakroom", // Batteries & Electrical Supplies (Essendant)

  // ── Thermometers (1344) → equipment ────────────────────────────────────
  1344: "equipment",

  // ── Janitorial & Sanitation (1432) — Essendant parent ──────────────────
  1432: "cleaning-chemicals",

  // ── Car Detailing ──────────────────────────────────────────────────────
  // (1730 already mapped above under chemicals tree)

  // ── Catch-all / Misc BC categories ────────────────────────────────────
  1340: "equipment",       // CUSTOMER SPECIFIC ADDED PRODUCTS (mixed, mostly equipment)
  1347: "packaging-film",  // CUSTOMER SPECIFIC (boxes, shipping, matting)
  1361: "breakroom",       // Essendant Products (cups, vacuum bags — mixed)
  1379: "breakroom",       // GENUINE JOE PRODUCTS (food storage bags)
  1442: "cleaning-chemicals", // Technology (toilet bowl cleaner)
};

// ---------------------------------------------------------------------------
// 3. Helper functions
// ---------------------------------------------------------------------------

/**
 * Given an array of BigCommerce category IDs (from a product), return the
 * best-matching site category slug.
 *
 * Priority order:
 *   1. Most specific mapped category (lowest parent depth, i.e. direct match)
 *   2. Falls back to the first mapped category found
 *   3. Returns "cleaning-chemicals" as the ultimate fallback (largest dept.)
 */
export function getSiteCategory(bcCategoryIds: number[]): string {
  // Priority ordering — more specific / "top-level" slugs first
  const PRIORITY: string[] = [
    "car-detailing",
    "paper-products",
    "trash-liners",
    "gloves-safety",
    "packaging-film",
    "floor-care",
    "breakroom",
    "equipment",
    "cleaning-chemicals",
  ];

  const matched = new Set<string>();

  for (const id of bcCategoryIds) {
    const slug = BC_CATEGORY_MAP[id];
    if (slug) matched.add(slug);
  }

  if (matched.size === 0) return "cleaning-chemicals";
  if (matched.size === 1) return Array.from(matched)[0];

  // Return the highest-priority match
  for (const slug of PRIORITY) {
    if (matched.has(slug)) return slug;
  }

  return "cleaning-chemicals";
}

/**
 * Return the human-readable display name for a site category slug.
 */
export function getSiteCategoryName(slug: string): string {
  return SITE_CATEGORY_NAMES[slug] ?? slug;
}
