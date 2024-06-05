let icons = [];
const modules = import.meta.glob("./../../assets/iconsCaiwu/svg/*.svg");
for (const path in modules) {
  const p = path.split("assets/iconsCaiwu/svg/")[1].split(".svg")[0];
  icons.push(p);
}

export default icons;
