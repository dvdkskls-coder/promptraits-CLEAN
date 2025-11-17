// src/data/camerasData.js

export const cameras = {
  "A. Camera Types": [
    {
      id: "full_frame",
      name: "Full Frame (35mm)",
      description:
        "36x24mm sensor; high dynamic range, better bokeh, low noise at high ISO, shallower depth of field.",
    },
    {
      id: "aps_c",
      name: "APS-C",
      description:
        "1.5-1.6x crop sensor; greater apparent reach ('free zoom'), deeper depth of field, lightweight.",
    },
    {
      id: "micro_four_thirds",
      name: "Micro 4/3 (MFT)",
      description:
        "2x crop sensor; very deep depth of field, excellent stabilization, great for video and lightweight telephotos.",
    },
    {
      id: "medium_format",
      name: "Medium Format",
      description:
        "Sensor larger than Full Frame; maximum quality, superior dynamic range, smooth color gradation, '3D look'.",
    },
    {
      id: "compact_camera",
      name: "Compact Camera",
      description:
        "Fixed lens, small sensor; very large depth of field, ideal for snapshots, poor low-light performance.",
    },
    {
      id: "bridge_superzoom",
      name: "Bridge / Superzoom",
      description:
        "Large, non-interchangeable focal range; versatile but with limited quality and large DOF.",
    },
    {
      id: "dslr",
      name: "DSLR",
      description:
        "Optical mirror; real viewfinder, excellent battery life, traditional look.",
    },
    {
      id: "mirrorless",
      name: "Mirrorless",
      description:
        "Lightweight, electronic viewfinder, advanced AF, superior video, silent.",
    },
    {
      id: "cinema_camera",
      name: "Cinema Camera",
      description:
        "RAW sensors, 12-16 bit color, wide latitude; ideal for film production.",
    },
    {
      id: "action_cam",
      name: "Action Cam",
      description:
        "Extreme wide-angle, durable, powerful stabilization; dynamic and ultra-wide look.",
    },
    {
      id: "360_camera",
      name: "360° Camera",
      description:
        "Records in all directions; immersive VR effect, total distortion.",
    },
    {
      id: "pinhole_camera",
      name: "Pinhole Camera",
      description:
        "No lens, just a tiny hole; infinite depth of field, extreme softness, dreamlike look.",
    },
  ],
  "B. Sensor Types": [
    {
      id: "bayer_sensor",
      name: "Bayer Sensor",
      description: "Classic sensor; good standard colorimetry.",
    },
    {
      id: "xtrans_sensor",
      name: "X-Trans Sensor (Fujifilm)",
      description: "Less moiré, more organic texture, 'grain feel'.",
    },
    {
      id: "foveon_sensor",
      name: "Foveon Sensor",
      description: "Captures color in layers; extreme film-like sharpness.",
    },
    {
      id: "quad_bayer_stacked",
      name: "Quad Bayer / Stacked Sensor",
      description: "High dynamic range, high speed for video and sports.",
    },
    {
      id: "global_shutter",
      name: "Global Shutter Sensor",
      description:
        "No rolling shutter; ideal for action, fast lights, and pro video.",
    },
  ],
};
