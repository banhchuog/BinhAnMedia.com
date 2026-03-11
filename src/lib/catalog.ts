// ─── Shared catalog data – imported by quote page AND admin panel ───

export type CatalogItem = {
  id: string;
  group: string;
  name: string;
  unit: string;
  unitPrice: number;
  optional?: boolean;
};

export type PresetItem = { id: string; qty: number };

export const CATALOG: CatalogItem[] = [
  // ── Tiền kỳ & Kịch bản ──
  { id: "scr_concept",   group: "Tiền kỳ & Kịch bản", name: "Phát triển ý tưởng & Concept",                   unit: "dự án",    unitPrice: 5_000_000 },
  { id: "scr_tvc",       group: "Tiền kỳ & Kịch bản", name: "Biên kịch TVC / quảng cáo (30–60s)",             unit: "kịch bản", unitPrice: 5_000_000 },
  { id: "scr_corp",      group: "Tiền kỳ & Kịch bản", name: "Biên kịch phim doanh nghiệp (3–5 phút)",         unit: "kịch bản", unitPrice: 8_000_000,  optional: true },
  { id: "scr_mv",        group: "Tiền kỳ & Kịch bản", name: "Biên kịch MV / phim ngắn",                       unit: "kịch bản", unitPrice: 10_000_000, optional: true },
  { id: "scr_social",    group: "Tiền kỳ & Kịch bản", name: "Script content social (5 ý tưởng)",              unit: "bộ",       unitPrice: 3_000_000,  optional: true },
  { id: "scr_treatment", group: "Tiền kỳ & Kịch bản", name: "Treatment / Brief sáng tạo",                     unit: "dự án",    unitPrice: 2_000_000 },
  { id: "scr_storyboard",group: "Tiền kỳ & Kịch bản", name: "Storyboard chi tiết",                            unit: "dự án",    unitPrice: 3_000_000 },
  { id: "scr_animatic",  group: "Tiền kỳ & Kịch bản", name: "Storyboard + Animatic (video minh hoạ)",         unit: "dự án",    unitPrice: 6_000_000,  optional: true },
  { id: "scr_shotlist",  group: "Tiền kỳ & Kịch bản", name: "Shot list & Floor plan chi tiết",                unit: "dự án",    unitPrice: 1_500_000 },
  { id: "scr_casting",   group: "Tiền kỳ & Kịch bản", name: "Casting phí (tuyển & duyệt diễn viên)",          unit: "dự án",    unitPrice: 3_000_000,  optional: true },
  { id: "scr_ppmeeting", group: "Tiền kỳ & Kịch bản", name: "Họp tiền kỳ (PPM – buổi duyệt)",                unit: "buổi",     unitPrice: 1_000_000 },
  { id: "scr_callsheet", group: "Tiền kỳ & Kịch bản", name: "Call sheet & Lịch quay chi tiết",               unit: "dự án",    unitPrice: 800_000 },

  // ── Đạo diễn & Sản xuất ──
  { id: "dir",        group: "Đạo diễn & Sản xuất", name: "Đạo diễn (Director)",              unit: "ngày", unitPrice: 8_000_000 },
  { id: "dop",        group: "Đạo diễn & Sản xuất", name: "Đạo diễn hình ảnh (DOP)",          unit: "ngày", unitPrice: 6_000_000 },
  { id: "1ad",        group: "Đạo diễn & Sản xuất", name: "Trợ lý đạo diễn 1 (1st AD)",       unit: "ngày", unitPrice: 2_500_000 },
  { id: "2ad",        group: "Đạo diễn & Sản xuất", name: "Trợ lý đạo diễn 2 (2nd AD)",       unit: "ngày", unitPrice: 1_200_000, optional: true },
  { id: "producer",   group: "Đạo diễn & Sản xuất", name: "Producer",                          unit: "ngày", unitPrice: 4_000_000 },
  { id: "pm",         group: "Đạo diễn & Sản xuất", name: "Production Manager",                unit: "ngày", unitPrice: 3_000_000 },
  { id: "coord",      group: "Đạo diễn & Sản xuất", name: "Production Coordinator",            unit: "ngày", unitPrice: 1_500_000, optional: true },
  { id: "script_sup", group: "Đạo diễn & Sản xuất", name: "Script Supervisor",                 unit: "ngày", unitPrice: 1_500_000, optional: true },
  { id: "runner",     group: "Đạo diễn & Sản xuất", name: "Runner / PA",                       unit: "ngày", unitPrice: 700_000,   optional: true },

  // ── Quay phim & Camera ──
  { id: "cam_op1",    group: "Quay phim & Camera", name: "Camera Operator chính",       unit: "ngày", unitPrice: 3_500_000 },
  { id: "cam_op2",    group: "Quay phim & Camera", name: "Camera Operator phụ",         unit: "ngày", unitPrice: 2_000_000, optional: true },
  { id: "focus",      group: "Quay phim & Camera", name: "Focus Puller (1st AC)",        unit: "ngày", unitPrice: 1_500_000 },
  { id: "cam_ass",    group: "Quay phim & Camera", name: "Camera Assistant (2nd AC)",    unit: "ngày", unitPrice: 1_000_000, optional: true },
  { id: "drone_pilot",group: "Quay phim & Camera", name: "Drone Pilot (gồm thiết bị)", unit: "ngày", unitPrice: 5_000_000, optional: true },
  { id: "steadicam",  group: "Quay phim & Camera", name: "Steadicam Operator",           unit: "ngày", unitPrice: 5_000_000, optional: true },

  // ── Ánh sáng ──
  { id: "gaffer",  group: "Ánh sáng", name: "Gaffer (Trưởng ánh sáng)", unit: "ngày", unitPrice: 3_000_000 },
  { id: "bestboy", group: "Ánh sáng", name: "Best Boy Electric",         unit: "ngày", unitPrice: 1_500_000 },
  { id: "spark",   group: "Ánh sáng", name: "Electrician / Spark",       unit: "ngày", unitPrice: 1_000_000, optional: true },

  // ── Âm thanh hiện trường ──
  { id: "sound_mix", group: "Âm thanh hiện trường", name: "Sound Mixer",    unit: "ngày", unitPrice: 3_000_000 },
  { id: "boom",      group: "Âm thanh hiện trường", name: "Boom Operator",  unit: "ngày", unitPrice: 1_500_000 },

  // ── Art & Styling ──
  { id: "art_dir",     group: "Art & Styling", name: "Art Director",       unit: "ngày", unitPrice: 4_000_000, optional: true },
  { id: "set_dec",     group: "Art & Styling", name: "Set Decorator",      unit: "ngày", unitPrice: 2_500_000, optional: true },
  { id: "props_master",group: "Art & Styling", name: "Props Master",       unit: "ngày", unitPrice: 1_500_000, optional: true },
  { id: "makeup",      group: "Art & Styling", name: "Makeup Artist",      unit: "ngày", unitPrice: 2_000_000 },
  { id: "hair",        group: "Art & Styling", name: "Hair Stylist",        unit: "ngày", unitPrice: 1_500_000, optional: true },
  { id: "wardrobe",    group: "Art & Styling", name: "Wardrobe Stylist",    unit: "ngày", unitPrice: 2_500_000, optional: true },
  { id: "wardrobe_ass",group: "Art & Styling", name: "Wardrobe Assistant",  unit: "ngày", unitPrice: 1_000_000, optional: true },

  // ── Diễn viên / Cast ──
  { id: "actor_main", group: "Diễn viên / Cast", name: "Diễn viên chính",            unit: "ngày",       unitPrice: 8_000_000, optional: true },
  { id: "actor_sub",  group: "Diễn viên / Cast", name: "Diễn viên phụ",              unit: "ngày",       unitPrice: 2_500_000, optional: true },
  { id: "extra",      group: "Diễn viên / Cast", name: "Diễn viên quần chúng",        unit: "người/ngày", unitPrice: 400_000,   optional: true },
  { id: "mc",         group: "Diễn viên / Cast", name: "MC / Host",                  unit: "ngày",       unitPrice: 5_000_000, optional: true },
  { id: "dancer",     group: "Diễn viên / Cast", name: "Dancer / Vũ công",           unit: "người/ngày", unitPrice: 2_000_000, optional: true },
  { id: "model",      group: "Diễn viên / Cast", name: "Người mẫu",                  unit: "ngày",       unitPrice: 4_000_000, optional: true },
  { id: "vo_artist",  group: "Diễn viên / Cast", name: "Voice Over Artist",           unit: "bài",        unitPrice: 2_000_000, optional: true },

  // ── Thiết bị Camera ──
  { id: "eq_pyxis6k", group: "Thiết bị Camera", name: "Blackmagic Pyxis 6K",           unit: "ngày", unitPrice: 2_500_000 },
  { id: "eq_fx3",     group: "Thiết bị Camera", name: "Sony FX3",                      unit: "ngày", unitPrice: 2_000_000, optional: true },
  { id: "eq_fx6",     group: "Thiết bị Camera", name: "Sony FX6",                      unit: "ngày", unitPrice: 3_500_000, optional: true },
  { id: "eq_fx9",     group: "Thiết bị Camera", name: "Sony FX9",                      unit: "ngày", unitPrice: 5_000_000, optional: true },
  { id: "eq_venice2", group: "Thiết bị Camera", name: "Sony Venice 2",                 unit: "ngày", unitPrice: 9_000_000, optional: true },
  { id: "eq_a7s3",    group: "Thiết bị Camera", name: "Sony A7S III (camera phụ)",    unit: "ngày", unitPrice: 1_500_000, optional: true },
  { id: "eq_red",     group: "Thiết bị Camera", name: "RED Komodo 6K",                 unit: "ngày", unitPrice: 6_000_000, optional: true },

  // ── Lens ──
  { id: "eq_prime3",    group: "Lens", name: "Bộ lens prime (3 ống)",            unit: "ngày", unitPrice: 3_000_000 },
  { id: "eq_zoom",      group: "Lens", name: "Bộ lens zoom 24-70 + 70-200",      unit: "ngày", unitPrice: 2_000_000, optional: true },
  { id: "eq_anamorphic",group: "Lens", name: "Lens anamorphic",                  unit: "ngày", unitPrice: 5_000_000, optional: true },
  { id: "eq_macro",     group: "Lens", name: "Macro lens",                        unit: "ngày", unitPrice: 800_000,   optional: true },

  // ── Camera Support ──
  { id: "eq_tripod",    group: "Camera Support", name: "Tripod chuyên nghiệp (Sachtler)", unit: "ngày", unitPrice: 800_000 },
  { id: "eq_gimbal_rs3",group: "Camera Support", name: "DJI RS3 Pro Gimbal",              unit: "ngày", unitPrice: 1_000_000 },
  { id: "eq_ronin4d",   group: "Camera Support", name: "DJI Ronin 4D",                    unit: "ngày", unitPrice: 4_000_000, optional: true },
  { id: "eq_slider",    group: "Camera Support", name: "Slider 1m",                        unit: "ngày", unitPrice: 800_000,   optional: true },
  { id: "eq_dolly",     group: "Camera Support", name: "Dolly + Track 3m",                 unit: "ngày", unitPrice: 3_000_000, optional: true },
  { id: "eq_jib3",      group: "Camera Support", name: "Jib / Crane 3m",                   unit: "ngày", unitPrice: 3_500_000, optional: true },
  { id: "eq_jib6",      group: "Camera Support", name: "Jib / Crane 6m",                   unit: "ngày", unitPrice: 5_000_000, optional: true },
  { id: "eq_camcar",    group: "Camera Support", name: "Camera Car (xe quay đường)",       unit: "ngày", unitPrice: 7_000_000, optional: true },
  { id: "eq_monitor",   group: "Camera Support", name: 'Monitor on-set 7"',                unit: "ngày", unitPrice: 600_000 },
  { id: "eq_matte",     group: "Camera Support", name: "Matte Box + Follow Focus",         unit: "ngày", unitPrice: 800_000,   optional: true },

  // ── Drone ──
  { id: "eq_mavic3",       group: "Drone", name: "DJI Mavic 3 Pro (gồm pilot)",     unit: "ngày", unitPrice: 4_000_000, optional: true },
  { id: "eq_inspire3",     group: "Drone", name: "DJI Inspire 3 (gồm pilot + op)", unit: "ngày", unitPrice: 8_000_000, optional: true },
  { id: "eq_drone_permit", group: "Drone", name: "Phí xin phép bay (CAAV)",         unit: "lần",  unitPrice: 3_000_000, optional: true },

  // ── Thiết bị Ánh sáng ──
  { id: "eq_aputure600",  group: "Thiết bị Ánh sáng", name: "Aputure LS 600d Pro",              unit: "ngày", unitPrice: 1_500_000 },
  { id: "eq_ledpanel",    group: "Thiết bị Ánh sáng", name: "LED Panel set (4 đèn)",            unit: "ngày", unitPrice: 1_500_000 },
  { id: "eq_softbox",     group: "Thiết bị Ánh sáng", name: "Softbox + Diffusion set",          unit: "ngày", unitPrice: 800_000 },
  { id: "eq_reflector",   group: "Thiết bị Ánh sáng", name: "Reflector set 5-in-1",             unit: "ngày", unitPrice: 200_000 },
  { id: "eq_arri_s60",    group: "Thiết bị Ánh sáng", name: "Arri SkyPanel S60",                unit: "ngày", unitPrice: 2_500_000, optional: true },
  { id: "eq_hmi1200",     group: "Thiết bị Ánh sáng", name: "HMI 1200W",                        unit: "ngày", unitPrice: 2_000_000, optional: true },
  { id: "eq_gen5kva",     group: "Thiết bị Ánh sáng", name: "Generator 5kVA",                   unit: "ngày", unitPrice: 1_500_000, optional: true },
  { id: "eq_expendables", group: "Thiết bị Ánh sáng", name: "Expendables (gaffer tape, gel…)", unit: "ngày", unitPrice: 300_000 },

  // ── Thiết bị Âm thanh ──
  { id: "eq_zoomf8",   group: "Thiết bị Âm thanh", name: "Sound Recorder Zoom F8n",        unit: "ngày", unitPrice: 800_000 },
  { id: "eq_lav",      group: "Thiết bị Âm thanh", name: "Wireless Lav Mic (bộ 2 cái)",   unit: "ngày", unitPrice: 1_000_000 },
  { id: "eq_boom_mic", group: "Thiết bị Âm thanh", name: "Boom Mic + Blimp",               unit: "ngày", unitPrice: 600_000 },

  // ── Bối cảnh & Địa điểm ──
  { id: "loc_studio",    group: "Bối cảnh & Địa điểm", name: "Studio phim trường (cyclorama)",        unit: "ngày",  unitPrice: 8_000_000 },
  { id: "loc_villa",     group: "Bối cảnh & Địa điểm", name: "Villa / Biệt thự",                      unit: "ngày",  unitPrice: 8_000_000,  optional: true },
  { id: "loc_office",    group: "Bối cảnh & Địa điểm", name: "Văn phòng cho thuê quay",               unit: "ngày",  unitPrice: 4_000_000,  optional: true },
  { id: "loc_cafe",      group: "Bối cảnh & Địa điểm", name: "Nhà hàng / Cafe",                       unit: "ngày",  unitPrice: 5_000_000,  optional: true },
  { id: "loc_rooftop",   group: "Bối cảnh & Địa điểm", name: "Rooftop / Sân thượng",                  unit: "ngày",  unitPrice: 3_000_000,  optional: true },
  { id: "loc_industrial",group: "Bối cảnh & Địa điểm", name: "Địa điểm công nghiệp / Kho",            unit: "ngày",  unitPrice: 4_000_000,  optional: true },
  { id: "loc_scout",     group: "Bối cảnh & Địa điểm", name: "Location Scout (khảo sát)",             unit: "ngày",  unitPrice: 2_000_000 },
  { id: "loc_permit",    group: "Bối cảnh & Địa điểm", name: "Phí xin phép quay công cộng",           unit: "lần",   unitPrice: 2_000_000,  optional: true },
  { id: "loc_setdress",  group: "Bối cảnh & Địa điểm", name: "Set Dressing (trang trí bối cảnh)",     unit: "dự án", unitPrice: 5_000_000,  optional: true },
  { id: "loc_props",     group: "Bối cảnh & Địa điểm", name: "Props thuê",                             unit: "ngày",  unitPrice: 1_500_000,  optional: true },
  { id: "loc_flowers",   group: "Bối cảnh & Địa điểm", name: "Hoa tươi / Cây cảnh trang trí",        unit: "dự án", unitPrice: 2_000_000,  optional: true },

  // ── Ăn uống ──
  { id: "food_main",     group: "Ăn uống", name: "Suất ăn chính (cơm hộp)",          unit: "người/ngày", unitPrice: 80_000 },
  { id: "food_premium",  group: "Ăn uống", name: "Suất ăn cao cấp (nhà hàng)",       unit: "người/ngày", unitPrice: 200_000, optional: true },
  { id: "food_teabreak", group: "Ăn uống", name: "Tea break (sáng + chiều)",          unit: "người/ngày", unitPrice: 80_000 },
  { id: "food_water",    group: "Ăn uống", name: "Nước uống bình 20L",               unit: "bình/ngày",  unitPrice: 60_000 },
  { id: "food_snack",    group: "Ăn uống", name: "Snack box (trái cây, bánh)",        unit: "ngày",       unitPrice: 500_000, optional: true },

  // ── Di chuyển & Vận chuyển ──
  { id: "trans_7",     group: "Di chuyển & Vận chuyển", name: "Xe 7 chỗ có tài xế",    unit: "ngày", unitPrice: 1_500_000 },
  { id: "trans_16",    group: "Di chuyển & Vận chuyển", name: "Xe 16 chỗ có tài xế",   unit: "ngày", unitPrice: 2_500_000, optional: true },
  { id: "trans_truck", group: "Di chuyển & Vận chuyển", name: "Xe tải chở thiết bị",   unit: "ngày", unitPrice: 1_200_000 },

  // ── Hậu kỳ – Dựng phim ──
  { id: "post_edit",       group: "Hậu kỳ – Dựng phim", name: "Lead Editor",                        unit: "ngày", unitPrice: 3_500_000 },
  { id: "post_edit_short", group: "Hậu kỳ – Dựng phim", name: "Cắt bản ngắn cho social (1 bản)",   unit: "bản",  unitPrice: 1_500_000, optional: true },

  // ── Hậu kỳ – Color Grading ──
  { id: "post_color_basic",  group: "Hậu kỳ – Color Grading", name: "Color grading cơ bản",                      unit: "dự án", unitPrice: 3_000_000 },
  { id: "post_color_cinema", group: "Hậu kỳ – Color Grading", name: "Color grade cinematic nâng cao",            unit: "dự án", unitPrice: 7_000_000,  optional: true },
  { id: "post_color_lut",    group: "Hậu kỳ – Color Grading", name: "Color grade + LUT riêng thương hiệu",       unit: "dự án", unitPrice: 12_000_000, optional: true },

  // ── Hậu kỳ – Motion & Animation ──
  { id: "post_logo_anim",     group: "Hậu kỳ – Motion & Animation", name: "Logo animation (5–10s)",               unit: "cái",   unitPrice: 3_000_000,  optional: true },
  { id: "post_lower3",        group: "Hậu kỳ – Motion & Animation", name: "Lower thirds (bộ 5 cái)",              unit: "bộ",    unitPrice: 2_000_000,  optional: true },
  { id: "post_kinetic",       group: "Hậu kỳ – Motion & Animation", name: "Kinetic typography (30s)",             unit: "dự án", unitPrice: 5_000_000,  optional: true },
  { id: "post_infographic",   group: "Hậu kỳ – Motion & Animation", name: "Infographic animation (30s)",          unit: "dự án", unitPrice: 8_000_000,  optional: true },
  { id: "post_explainer",     group: "Hậu kỳ – Motion & Animation", name: "Explainer video animation (1 phút)",  unit: "dự án", unitPrice: 15_000_000, optional: true },
  { id: "post_motion_designer",group: "Hậu kỳ – Motion & Animation", name: "Motion Graphics Designer",            unit: "ngày",  unitPrice: 4_000_000,  optional: true },

  // ── Hậu kỳ – VFX ──
  { id: "post_vfx_clean",    group: "Hậu kỳ – VFX", name: "Xóa đối tượng / Clean plate",  unit: "shot",  unitPrice: 1_000_000,  optional: true },
  { id: "post_vfx_sky",      group: "Hậu kỳ – VFX", name: "Sky replacement",               unit: "shot",  unitPrice: 800_000,    optional: true },
  { id: "post_vfx_screen",   group: "Hậu kỳ – VFX", name: "Screen replacement",            unit: "shot",  unitPrice: 1_500_000,  optional: true },
  { id: "post_vfx_cgi",      group: "Hậu kỳ – VFX", name: "CGI object đơn giản",           unit: "dự án", unitPrice: 10_000_000, optional: true },
  { id: "post_vfx_particle", group: "Hậu kỳ – VFX", name: "Particle effect (khói, lửa…)", unit: "shot",  unitPrice: 3_000_000,  optional: true },
  { id: "post_vfx_artist",   group: "Hậu kỳ – VFX", name: "VFX Artist",                    unit: "ngày",  unitPrice: 8_000_000,  optional: true },

  // ── Hậu kỳ – Âm thanh ──
  { id: "post_sound_mix",     group: "Hậu kỳ – Âm thanh", name: "Mix âm thanh cơ bản",                      unit: "dự án",   unitPrice: 3_000_000 },
  { id: "post_sound_mix_adv", group: "Hậu kỳ – Âm thanh", name: "Mix âm thanh nâng cao",                    unit: "dự án",   unitPrice: 6_000_000,  optional: true },
  { id: "post_sound_design",  group: "Hậu kỳ – Âm thanh", name: "Sound design",                              unit: "dự án",   unitPrice: 5_000_000,  optional: true },
  { id: "post_music_lib",     group: "Hậu kỳ – Âm thanh", name: "Nhạc nền thư viện có bản quyền",           unit: "bài",     unitPrice: 1_000_000 },
  { id: "post_music_orig",    group: "Hậu kỳ – Âm thanh", name: "Sáng tác nhạc riêng (original)",           unit: "bài",     unitPrice: 15_000_000, optional: true },
  { id: "post_vo_studio",     group: "Hậu kỳ – Âm thanh", name: "Thu âm Voice Over (phòng thu)",            unit: "bài",     unitPrice: 2_000_000,  optional: true },
  { id: "post_subtitle",      group: "Hậu kỳ – Âm thanh", name: "Phụ đề + dịch thuật (1 ngôn ngữ)",        unit: "ngôn ngữ",unitPrice: 2_000_000,  optional: true },

  // ── Xuất & Bàn giao ──
  { id: "del_export", group: "Xuất & Bàn giao", name: "Export nhiều định dạng (5+ files)", unit: "lần",   unitPrice: 1_000_000 },
  { id: "del_hdd",    group: "Xuất & Bàn giao", name: "Bàn giao file qua HDD",             unit: "cái",   unitPrice: 500_000,   optional: true },
  { id: "del_cloud",  group: "Xuất & Bàn giao", name: "Cloud storage 3 tháng",             unit: "dự án", unitPrice: 300_000 },
];

export const GROUPS = Array.from(new Set(CATALOG.map((c) => c.group)));

export const DEFAULT_PRESETS: Record<string, PresetItem[]> = {
  // ── TVC Cao cấp ──
  tvc: [
    { id: "scr_concept", qty: 1 }, { id: "scr_tvc", qty: 1 }, { id: "scr_treatment", qty: 1 },
    { id: "scr_storyboard", qty: 1 }, { id: "scr_shotlist", qty: 1 },
    { id: "scr_ppmeeting", qty: 1 }, { id: "scr_callsheet", qty: 1 },
    { id: "dir", qty: 1 }, { id: "dop", qty: 1 }, { id: "1ad", qty: 1 },
    { id: "producer", qty: 1 }, { id: "pm", qty: 1 },
    { id: "cam_op1", qty: 1 }, { id: "focus", qty: 1 },
    { id: "gaffer", qty: 1 }, { id: "bestboy", qty: 1 },
    { id: "sound_mix", qty: 1 }, { id: "boom", qty: 1 },
    { id: "makeup", qty: 1 },
    { id: "eq_pyxis6k", qty: 1 }, { id: "eq_prime3", qty: 1 },
    { id: "eq_tripod", qty: 1 }, { id: "eq_gimbal_rs3", qty: 1 }, { id: "eq_monitor", qty: 1 },
    { id: "eq_aputure600", qty: 2 }, { id: "eq_ledpanel", qty: 1 },
    { id: "eq_softbox", qty: 1 }, { id: "eq_reflector", qty: 1 }, { id: "eq_expendables", qty: 1 },
    { id: "eq_zoomf8", qty: 1 }, { id: "eq_lav", qty: 1 }, { id: "eq_boom_mic", qty: 1 },
    { id: "loc_studio", qty: 1 }, { id: "loc_scout", qty: 1 },
    { id: "food_main", qty: 10 }, { id: "food_teabreak", qty: 10 }, { id: "food_water", qty: 2 },
    { id: "trans_7", qty: 1 }, { id: "trans_truck", qty: 1 },
    { id: "post_edit", qty: 3 }, { id: "post_color_basic", qty: 1 },
    { id: "post_sound_mix", qty: 1 }, { id: "post_music_lib", qty: 1 },
    { id: "del_export", qty: 1 }, { id: "del_cloud", qty: 1 },
  ],
  // ── MV Cao cấp ──
  mv: [
    { id: "scr_concept", qty: 1 }, { id: "scr_mv", qty: 1 }, { id: "scr_treatment", qty: 1 },
    { id: "scr_storyboard", qty: 1 }, { id: "scr_animatic", qty: 1 }, { id: "scr_shotlist", qty: 1 },
    { id: "scr_casting", qty: 1 }, { id: "scr_ppmeeting", qty: 2 }, { id: "scr_callsheet", qty: 1 },
    { id: "dir", qty: 2 }, { id: "dop", qty: 2 }, { id: "1ad", qty: 2 },
    { id: "producer", qty: 2 }, { id: "pm", qty: 2 },
    { id: "cam_op1", qty: 2 }, { id: "cam_op2", qty: 2 }, { id: "focus", qty: 2 },
    { id: "drone_pilot", qty: 1 }, { id: "steadicam", qty: 1 },
    { id: "gaffer", qty: 2 }, { id: "bestboy", qty: 2 }, { id: "spark", qty: 2 },
    { id: "sound_mix", qty: 2 }, { id: "boom", qty: 2 },
    { id: "art_dir", qty: 2 }, { id: "makeup", qty: 2 }, { id: "hair", qty: 2 }, { id: "wardrobe", qty: 2 },
    { id: "actor_main", qty: 2 },
    { id: "eq_pyxis6k", qty: 1 }, { id: "eq_fx3", qty: 1 }, { id: "eq_prime3", qty: 1 },
    { id: "eq_anamorphic", qty: 1 }, { id: "eq_tripod", qty: 1 },
    { id: "eq_gimbal_rs3", qty: 1 }, { id: "eq_slider", qty: 1 }, { id: "eq_monitor", qty: 2 },
    { id: "eq_mavic3", qty: 1 },
    { id: "eq_aputure600", qty: 3 }, { id: "eq_arri_s60", qty: 2 }, { id: "eq_softbox", qty: 2 },
    { id: "eq_reflector", qty: 2 }, { id: "eq_expendables", qty: 2 },
    { id: "eq_zoomf8", qty: 1 }, { id: "eq_lav", qty: 2 }, { id: "eq_boom_mic", qty: 1 },
    { id: "loc_villa", qty: 2 }, { id: "loc_scout", qty: 2 }, { id: "loc_setdress", qty: 1 }, { id: "loc_flowers", qty: 1 },
    { id: "food_main", qty: 20 }, { id: "food_teabreak", qty: 20 }, { id: "food_water", qty: 4 },
    { id: "trans_7", qty: 2 }, { id: "trans_truck", qty: 1 },
    { id: "post_edit", qty: 5 }, { id: "post_color_cinema", qty: 1 },
    { id: "post_sound_mix_adv", qty: 1 }, { id: "post_music_lib", qty: 1 }, { id: "post_motion_designer", qty: 2 },
    { id: "del_export", qty: 1 }, { id: "del_cloud", qty: 1 },
  ],
  // ── Corporate Cao cấp ──
  corporate: [
    { id: "scr_concept", qty: 1 }, { id: "scr_corp", qty: 1 }, { id: "scr_treatment", qty: 1 },
    { id: "scr_storyboard", qty: 1 }, { id: "scr_shotlist", qty: 1 },
    { id: "scr_ppmeeting", qty: 2 }, { id: "scr_callsheet", qty: 1 },
    { id: "dir", qty: 2 }, { id: "dop", qty: 2 }, { id: "1ad", qty: 2 },
    { id: "producer", qty: 2 }, { id: "pm", qty: 2 },
    { id: "cam_op1", qty: 2 }, { id: "focus", qty: 2 },
    { id: "gaffer", qty: 2 }, { id: "bestboy", qty: 2 },
    { id: "sound_mix", qty: 2 }, { id: "boom", qty: 2 },
    { id: "makeup", qty: 2 },
    { id: "eq_pyxis6k", qty: 1 }, { id: "eq_fx3", qty: 1 }, { id: "eq_prime3", qty: 1 },
    { id: "eq_tripod", qty: 2 }, { id: "eq_gimbal_rs3", qty: 1 }, { id: "eq_monitor", qty: 2 },
    { id: "eq_aputure600", qty: 2 }, { id: "eq_ledpanel", qty: 2 }, { id: "eq_softbox", qty: 2 },
    { id: "eq_reflector", qty: 2 }, { id: "eq_expendables", qty: 2 },
    { id: "eq_zoomf8", qty: 1 }, { id: "eq_lav", qty: 2 }, { id: "eq_boom_mic", qty: 1 },
    { id: "loc_office", qty: 2 }, { id: "loc_scout", qty: 1 }, { id: "loc_permit", qty: 1 },
    { id: "food_main", qty: 15 }, { id: "food_teabreak", qty: 15 }, { id: "food_water", qty: 3 },
    { id: "trans_7", qty: 2 }, { id: "trans_truck", qty: 1 },
    { id: "post_edit", qty: 4 }, { id: "post_color_basic", qty: 1 },
    { id: "post_motion_designer", qty: 2 }, { id: "post_lower3", qty: 1 }, { id: "post_logo_anim", qty: 1 },
    { id: "post_sound_mix", qty: 1 }, { id: "post_music_lib", qty: 1 }, { id: "post_vo_studio", qty: 1 },
    { id: "post_subtitle", qty: 2 },
    { id: "del_export", qty: 1 }, { id: "del_cloud", qty: 1 },
  ],
  // ── Social Cao cấp ──
  social: [
    { id: "scr_concept", qty: 1 }, { id: "scr_social", qty: 1 }, { id: "scr_shotlist", qty: 1 },
    { id: "scr_callsheet", qty: 1 },
    { id: "dir", qty: 1 }, { id: "cam_op1", qty: 1 },
    { id: "gaffer", qty: 1 }, { id: "makeup", qty: 1 },
    { id: "eq_fx3", qty: 1 }, { id: "eq_prime3", qty: 1 },
    { id: "eq_gimbal_rs3", qty: 1 }, { id: "eq_tripod", qty: 1 },
    { id: "eq_ledpanel", qty: 1 }, { id: "eq_softbox", qty: 1 }, { id: "eq_reflector", qty: 1 }, { id: "eq_expendables", qty: 1 },
    { id: "eq_lav", qty: 1 },
    { id: "loc_studio", qty: 1 },
    { id: "food_main", qty: 6 }, { id: "food_teabreak", qty: 6 }, { id: "food_water", qty: 1 },
    { id: "trans_7", qty: 1 },
    { id: "post_edit", qty: 2 }, { id: "post_color_basic", qty: 1 },
    { id: "post_sound_mix", qty: 1 }, { id: "post_music_lib", qty: 1 },
    { id: "del_export", qty: 1 }, { id: "del_cloud", qty: 1 },
  ],
  // ── Event Cao cấp ──
  event: [
    { id: "scr_concept", qty: 1 }, { id: "scr_treatment", qty: 1 },
    { id: "scr_shotlist", qty: 1 }, { id: "scr_ppmeeting", qty: 1 }, { id: "scr_callsheet", qty: 1 },
    { id: "dir", qty: 1 }, { id: "dop", qty: 1 }, { id: "pm", qty: 1 },
    { id: "cam_op1", qty: 2 }, { id: "cam_op2", qty: 2 }, { id: "focus", qty: 1 },
    { id: "gaffer", qty: 1 }, { id: "bestboy", qty: 1 },
    { id: "sound_mix", qty: 1 }, { id: "boom", qty: 1 },
    { id: "eq_fx6", qty: 2 }, { id: "eq_a7s3", qty: 2 }, { id: "eq_prime3", qty: 1 }, { id: "eq_zoom", qty: 1 },
    { id: "eq_tripod", qty: 2 }, { id: "eq_gimbal_rs3", qty: 1 }, { id: "eq_monitor", qty: 2 },
    { id: "eq_mavic3", qty: 1 },
    { id: "eq_aputure600", qty: 2 }, { id: "eq_ledpanel", qty: 2 }, { id: "eq_reflector", qty: 2 }, { id: "eq_expendables", qty: 1 },
    { id: "eq_zoomf8", qty: 1 }, { id: "eq_lav", qty: 2 }, { id: "eq_boom_mic", qty: 1 },
    { id: "loc_permit", qty: 1 },
    { id: "food_main", qty: 12 }, { id: "food_teabreak", qty: 12 }, { id: "food_water", qty: 2 },
    { id: "trans_7", qty: 1 }, { id: "trans_truck", qty: 1 },
    { id: "post_edit", qty: 3 }, { id: "post_color_basic", qty: 1 },
    { id: "post_sound_mix", qty: 1 }, { id: "post_music_lib", qty: 1 },
    { id: "del_export", qty: 1 }, { id: "del_cloud", qty: 1 },
  ],
  // ── Recap sự kiện (giá tốt) ──
  event_recap: [
    { id: "scr_shotlist", qty: 1 }, { id: "scr_callsheet", qty: 1 },
    { id: "cam_op1", qty: 1 }, { id: "cam_op2", qty: 1 },
    { id: "gaffer", qty: 1 },
    { id: "eq_fx3", qty: 1 }, { id: "eq_a7s3", qty: 1 },
    { id: "eq_prime3", qty: 1 }, { id: "eq_zoom", qty: 1 },
    { id: "eq_tripod", qty: 1 }, { id: "eq_gimbal_rs3", qty: 1 },
    { id: "eq_ledpanel", qty: 1 }, { id: "eq_reflector", qty: 1 }, { id: "eq_expendables", qty: 1 },
    { id: "eq_lav", qty: 1 },
    { id: "food_main", qty: 4 }, { id: "food_water", qty: 1 },
    { id: "trans_7", qty: 1 },
    { id: "post_edit", qty: 2 }, { id: "post_color_basic", qty: 1 },
    { id: "post_sound_mix", qty: 1 }, { id: "post_music_lib", qty: 1 },
    { id: "del_export", qty: 1 }, { id: "del_cloud", qty: 1 },
  ],
  // ── Video quảng cáo nhỏ (giá tốt) ──
  small_ad: [
    { id: "scr_concept", qty: 1 }, { id: "scr_tvc", qty: 1 },
    { id: "scr_shotlist", qty: 1 }, { id: "scr_callsheet", qty: 1 },
    { id: "dir", qty: 1 }, { id: "cam_op1", qty: 1 },
    { id: "gaffer", qty: 1 },
    { id: "makeup", qty: 1 },
    { id: "eq_fx3", qty: 1 }, { id: "eq_prime3", qty: 1 },
    { id: "eq_tripod", qty: 1 }, { id: "eq_gimbal_rs3", qty: 1 },
    { id: "eq_ledpanel", qty: 1 }, { id: "eq_softbox", qty: 1 }, { id: "eq_reflector", qty: 1 }, { id: "eq_expendables", qty: 1 },
    { id: "eq_lav", qty: 1 },
    { id: "loc_studio", qty: 1 },
    { id: "food_main", qty: 4 }, { id: "food_water", qty: 1 },
    { id: "post_edit", qty: 1 }, { id: "post_color_basic", qty: 1 },
    { id: "post_sound_mix", qty: 1 }, { id: "post_music_lib", qty: 1 },
    { id: "del_export", qty: 1 }, { id: "del_cloud", qty: 1 },
  ],
  // ── Gói Social 10+ video (giá tốt theo combo) ──
  social_bulk: [
    { id: "scr_concept", qty: 1 }, { id: "scr_social", qty: 2 },
    { id: "scr_shotlist", qty: 1 }, { id: "scr_callsheet", qty: 1 },
    { id: "dir", qty: 2 }, { id: "cam_op1", qty: 2 },
    { id: "gaffer", qty: 2 }, { id: "makeup", qty: 2 },
    { id: "eq_fx3", qty: 1 }, { id: "eq_a7s3", qty: 1 }, { id: "eq_prime3", qty: 1 },
    { id: "eq_tripod", qty: 1 }, { id: "eq_gimbal_rs3", qty: 1 },
    { id: "eq_ledpanel", qty: 1 }, { id: "eq_softbox", qty: 1 }, { id: "eq_reflector", qty: 1 }, { id: "eq_expendables", qty: 2 },
    { id: "eq_lav", qty: 1 },
    { id: "loc_studio", qty: 2 },
    { id: "food_main", qty: 10 }, { id: "food_teabreak", qty: 10 }, { id: "food_water", qty: 2 },
    { id: "trans_7", qty: 2 },
    { id: "post_edit", qty: 5 }, { id: "post_edit_short", qty: 10 },
    { id: "post_color_basic", qty: 1 },
    { id: "post_sound_mix", qty: 1 }, { id: "post_music_lib", qty: 3 },
    { id: "del_export", qty: 1 }, { id: "del_cloud", qty: 1 },
  ],
};

// ── Gói Cơ bản (kinh phí thấp) ──────────────────────────────────────────
export const BASIC_PRESETS: Record<string, PresetItem[]> = {
  tvc: [
    { id: "scr_concept", qty: 1 }, { id: "scr_tvc", qty: 1 },
    { id: "scr_shotlist", qty: 1 }, { id: "scr_callsheet", qty: 1 },
    { id: "dir", qty: 1 }, { id: "cam_op1", qty: 1 },
    { id: "gaffer", qty: 1 }, { id: "makeup", qty: 1 },
    { id: "eq_pyxis6k", qty: 1 }, { id: "eq_prime3", qty: 1 },
    { id: "eq_tripod", qty: 1 }, { id: "eq_gimbal_rs3", qty: 1 },
    { id: "eq_ledpanel", qty: 1 }, { id: "eq_softbox", qty: 1 }, { id: "eq_reflector", qty: 1 }, { id: "eq_expendables", qty: 1 },
    { id: "eq_lav", qty: 1 },
    { id: "loc_studio", qty: 1 },
    { id: "food_main", qty: 5 }, { id: "food_water", qty: 1 },
    { id: "trans_7", qty: 1 },
    { id: "post_edit", qty: 2 }, { id: "post_color_basic", qty: 1 },
    { id: "post_sound_mix", qty: 1 }, { id: "post_music_lib", qty: 1 },
    { id: "del_export", qty: 1 }, { id: "del_cloud", qty: 1 },
  ],
  mv: [
    { id: "scr_concept", qty: 1 }, { id: "scr_mv", qty: 1 },
    { id: "scr_shotlist", qty: 1 }, { id: "scr_callsheet", qty: 1 },
    { id: "dir", qty: 1 }, { id: "dop", qty: 1 },
    { id: "cam_op1", qty: 1 }, { id: "focus", qty: 1 },
    { id: "gaffer", qty: 1 }, { id: "bestboy", qty: 1 },
    { id: "sound_mix", qty: 1 },
    { id: "makeup", qty: 1 },
    { id: "eq_pyxis6k", qty: 1 }, { id: "eq_prime3", qty: 1 },
    { id: "eq_tripod", qty: 1 }, { id: "eq_gimbal_rs3", qty: 1 }, { id: "eq_monitor", qty: 1 },
    { id: "eq_aputure600", qty: 1 }, { id: "eq_ledpanel", qty: 1 },
    { id: "eq_softbox", qty: 1 }, { id: "eq_reflector", qty: 1 }, { id: "eq_expendables", qty: 1 },
    { id: "eq_lav", qty: 1 }, { id: "eq_boom_mic", qty: 1 },
    { id: "loc_scout", qty: 1 },
    { id: "food_main", qty: 8 }, { id: "food_water", qty: 2 },
    { id: "trans_7", qty: 1 },
    { id: "post_edit", qty: 3 }, { id: "post_color_basic", qty: 1 },
    { id: "post_sound_mix", qty: 1 }, { id: "post_music_lib", qty: 1 },
    { id: "del_export", qty: 1 }, { id: "del_cloud", qty: 1 },
  ],
  corporate: [
    { id: "scr_concept", qty: 1 }, { id: "scr_corp", qty: 1 },
    { id: "scr_shotlist", qty: 1 }, { id: "scr_callsheet", qty: 1 },
    { id: "dir", qty: 1 }, { id: "cam_op1", qty: 1 },
    { id: "gaffer", qty: 1 },
    { id: "sound_mix", qty: 1 },
    { id: "makeup", qty: 1 },
    { id: "eq_pyxis6k", qty: 1 }, { id: "eq_prime3", qty: 1 },
    { id: "eq_tripod", qty: 1 }, { id: "eq_gimbal_rs3", qty: 1 },
    { id: "eq_ledpanel", qty: 1 }, { id: "eq_softbox", qty: 1 }, { id: "eq_reflector", qty: 1 }, { id: "eq_expendables", qty: 1 },
    { id: "eq_lav", qty: 1 },
    { id: "loc_office", qty: 1 }, { id: "loc_scout", qty: 1 },
    { id: "food_main", qty: 6 }, { id: "food_water", qty: 1 },
    { id: "trans_7", qty: 1 },
    { id: "post_edit", qty: 2 }, { id: "post_color_basic", qty: 1 },
    { id: "post_sound_mix", qty: 1 }, { id: "post_music_lib", qty: 1 },
    { id: "post_subtitle", qty: 1 },
    { id: "del_export", qty: 1 }, { id: "del_cloud", qty: 1 },
  ],
  social: [
    { id: "scr_social", qty: 1 }, { id: "scr_callsheet", qty: 1 },
    { id: "dir", qty: 1 }, { id: "cam_op1", qty: 1 },
    { id: "makeup", qty: 1 },
    { id: "eq_fx3", qty: 1 }, { id: "eq_prime3", qty: 1 },
    { id: "eq_gimbal_rs3", qty: 1 },
    { id: "eq_ledpanel", qty: 1 }, { id: "eq_reflector", qty: 1 }, { id: "eq_expendables", qty: 1 },
    { id: "eq_lav", qty: 1 },
    { id: "food_main", qty: 4 }, { id: "food_water", qty: 1 },
    { id: "post_edit", qty: 1 }, { id: "post_color_basic", qty: 1 },
    { id: "post_sound_mix", qty: 1 }, { id: "post_music_lib", qty: 1 },
    { id: "del_export", qty: 1 }, { id: "del_cloud", qty: 1 },
  ],
  event: [
    { id: "scr_shotlist", qty: 1 }, { id: "scr_callsheet", qty: 1 },
    { id: "dir", qty: 1 }, { id: "cam_op1", qty: 1 },
    { id: "gaffer", qty: 1 },
    { id: "sound_mix", qty: 1 },
    { id: "eq_fx3", qty: 1 }, { id: "eq_a7s3", qty: 1 }, { id: "eq_prime3", qty: 1 },
    { id: "eq_tripod", qty: 1 }, { id: "eq_gimbal_rs3", qty: 1 },
    { id: "eq_ledpanel", qty: 1 }, { id: "eq_reflector", qty: 1 }, { id: "eq_expendables", qty: 1 },
    { id: "eq_lav", qty: 1 }, { id: "eq_boom_mic", qty: 1 },
    { id: "food_main", qty: 6 }, { id: "food_water", qty: 1 },
    { id: "trans_7", qty: 1 },
    { id: "post_edit", qty: 2 }, { id: "post_color_basic", qty: 1 },
    { id: "post_sound_mix", qty: 1 }, { id: "post_music_lib", qty: 1 },
    { id: "del_export", qty: 1 }, { id: "del_cloud", qty: 1 },
  ],
};
