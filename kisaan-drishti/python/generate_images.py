import random, math
from PIL import Image, ImageDraw, ImageFilter
random.seed(7)
O="../images/"

def grad(w,h,top,bot):
    im=Image.new("RGB",(w,h)); d=ImageDraw.Draw(im)
    for y in range(h):
        t=y/h; d.line([(0,y),(w,y)],fill=tuple(int(top[i]+(bot[i]-top[i])*t) for i in range(3)))
    return im

# ---------- hero landscape ----------
W,H=1600,800
im=grad(W,H,(255,183,120),(255,236,179)); d=ImageDraw.Draw(im)
d.ellipse((1150,230,1350,430),fill=(255,244,200))
for i,(c,base,amp) in enumerate([((120,160,110),420,50),((86,140,80),480,40),((56,118,60),540,30)]):
    pts=[(0,H)]+[(x,base+amp*math.sin(x/230+i*2)) for x in range(0,W+20,20)]+[(W,H)]
    d.polygon(pts,fill=c)
# crop rows in perspective
vx,vy=800,560
for k in range(-30,31):
    x=vx+k*140
    d.polygon([(vx+k*6,vy),(vx+k*6+4,vy),(x+50,H),(x-50,H)],fill=(46+abs(k)%2*14,120+abs(k)%2*20,52))
for y in range(vy,H,18):
    t=(y-vy)/(H-vy)
    for k in range(-25,26,2):
        x=vx+k*(6+134*t)
        r=2+8*t; d.ellipse((x-r,y-r,x+r,y+r),fill=(90,170,80))
im=im.filter(ImageFilter.GaussianBlur(1.2)); im.convert("RGB").save(O+"hero.jpg",quality=88)

# ---------- leaf samples ----------
def leaf(name,base,spots,spot_col,extra=None):
    S=512; im=grad(S,S,(210,225,200),(170,195,160)); d=ImageDraw.Draw(im)
    # leaf shape
    pts=[]
    for a in range(0,361,4):
        r=math.radians(a); x=S/2+190*math.sin(r)*abs(math.sin(r/2+.01))**.3*1.0; y=S/2-230*math.cos(r)*0.95
        pts.append((x,y))
    d.polygon(pts,fill=base)
    d.line([(S/2,50),(S/2,470)],fill=tuple(min(255,c+40) for c in base),width=7)
    for i in range(8):
        y=110+i*45
        d.line([(S/2,y+20),(S/2-110+i*4,y-30)],fill=tuple(min(255,c+25) for c in base),width=3)
        d.line([(S/2,y+20),(S/2+110-i*4,y-30)],fill=tuple(min(255,c+25) for c in base),width=3)
    for _ in range(spots):
        x=S/2+random.randint(-110,110); y=random.randint(100,420); r=random.randint(6,16)
        d.ellipse((x-r-4,y-r-4,x+r+4,y+r+4),fill=(220,190,60) if name!="powdery_mildew" else (240,240,235))
        d.ellipse((x-r,y-r,x+r,y+r),fill=spot_col)
    if extra=="blight":
        d.polygon([(S/2+20,380),(S/2+120,300),(S/2+150,360),(S/2+90,440)],fill=(110,80,40))
        d.polygon([(S/2-30,160),(S/2-110,200),(S/2-100,260),(S/2-20,230)],fill=(120,90,50))
    im.filter(ImageFilter.GaussianBlur(.8)).save(O+"samples/"+name+".png")
leaf("healthy",(60,150,60),0,(0,0,0))
leaf("brown_spot",(80,150,60),34,(110,60,25))
leaf("leaf_blight",(85,140,55),6,(120,90,50),"blight")
leaf("powdery_mildew",(70,145,70),45,(235,235,230))
leaf("leaf_rust",(85,150,60),40,(200,100,30))

# ---------- crop tiles ----------
CR={"Rice":((226,240,190),(120,170,60),"stalk"),"Wheat":((250,235,170),(200,150,40),"stalk"),
"Cotton":((225,240,225),(255,255,255),"puff"),"Maize":((255,240,170),(240,190,30),"cob"),
"Groundnut":((240,225,200),(170,120,70),"round"),"Soybean":((215,235,190),(140,170,80),"round"),
"Chickpea":((245,230,190),(210,170,90),"round"),"Mustard":((255,250,170),(240,200,0),"flower"),
"Sugarcane":((210,240,200),(90,160,70),"cane"),"Watermelon":((205,235,205),(220,60,70),"round"),
"Cucumber":((215,240,200),(60,140,60),"cuke"),"Tomato":((255,225,215),(220,40,40),"round")}
for n,(bg,fg,kind) in CR.items():
    S=320; im=Image.new("RGB",(S,S),bg); d=ImageDraw.Draw(im); c=S//2
    d.ellipse((30,230,290,300),fill=tuple(int(x*.85) for x in bg))
    if kind=="stalk":
        for dx in (-60,0,60):
            d.line([(c+dx,270),(c+dx,110)],fill=(90,140,50),width=5)
            for j in range(7):
                y=110+j*15; d.ellipse((c+dx-16,y-8,c+dx,y+8),fill=fg); d.ellipse((c+dx,y-8,c+dx+16,y+8),fill=fg)
    elif kind=="puff":
        d.line([(c,270),(c,150)],fill=(90,130,60),width=6)
        for ox,oy in [(-30,120),(30,120),(0,95),(0,140)]: d.ellipse((c+ox-32,oy-32,c+ox+32,oy+32),fill=fg,outline=(190,205,190),width=3)
        d.polygon([(c-45,160),(c,200),(c+45,160),(c,230)],fill=(110,70,40))
    elif kind=="cob":
        d.polygon([(c-60,260),(c-10,90),(c+30,100),(c+10,260)],fill=(110,170,70))
        d.ellipse((c-30,60,c+40,230),fill=fg)
        for yy in range(80,220,16):
            for xx in range(-22,34,16): d.ellipse((c+xx-5,yy-5,c+xx+5,yy+5),fill=(255,215,90))
    elif kind=="round":
        d.line([(c,110),(c,80)],fill=(60,120,50),width=6); d.polygon([(c,85),(c-30,70),(c-10,95)],fill=(60,140,50))
        d.ellipse((c-85,100,c+85,255),fill=fg)
        d.ellipse((c-55,120,c-25,150),fill=tuple(min(255,x+60) for x in fg))
        if n=="Watermelon":
            for k in range(-60,61,30): d.arc((c-85+abs(k)//3,100,c+85-abs(k)//3,255),90+k,270-k,fill=(40,110,50),width=4)
    elif kind=="flower":
        d.line([(c,270),(c,120)],fill=(90,140,50),width=5)
        for k in range(10):
            a=k*math.pi/5; d.ellipse((c+math.cos(a)*40-18,115+math.sin(a)*40-18,c+math.cos(a)*40+18,115+math.sin(a)*40+18),fill=fg)
        d.ellipse((c-18,97,c+18,133),fill=(120,80,20))
    elif kind=="cane":
        for dx in (-50,0,50):
            d.rectangle((c+dx-9,70,c+dx+9,275),fill=fg)
            for yy in range(90,275,35): d.line([(c+dx-9,yy),(c+dx+9,yy)],fill=(60,110,50),width=3)
            d.polygon([(c+dx,70),(c+dx-45,35),(c+dx-10,75)],fill=(110,180,80)); d.polygon([(c+dx,70),(c+dx+45,35),(c+dx+10,75)],fill=(110,180,80))
    elif kind=="cuke":
        d.rounded_rectangle((c-30,70,c+30,265),30,fill=fg)
        for yy in range(95,250,25): d.ellipse((c-8,yy,c+4,yy+8),fill=(150,210,120))
    im.save(O+"crops/"+n.lower()+".png")

# ---------- dashboard mock ----------
W,H=1200,700; im=Image.new("RGB",(W,H),(241,248,242)); d=ImageDraw.Draw(im)
d.rectangle((0,0,W,60),fill=(27,94,32)); d.ellipse((20,14,52,46),fill=(165,214,167))
d.rectangle((70,24,220,36),fill=(200,230,200))
cards=[("Farm Health","80/100",(46,125,50)),("Soil Moisture","35%",(30,136,229)),("Temperature","33°C",(239,108,0)),("Disease Alerts","1",(198,40,40))]
for i,(t,v,c) in enumerate(cards):
    x=30+i*290; d.rounded_rectangle((x,90,x+270,200),14,fill="white"); d.rectangle((x,90,x+8,200),fill=c)
    d.text((x+24,110),t,fill=(90,90,90)); d.text((x+24,150),v,fill=c,font_size=36) if hasattr(d,"text") else None
d.rounded_rectangle((30,230,730,670),14,fill="white"); d.text((50,248),"Yield forecast (quintal/acre)",fill=(60,60,60))
vals=[14,18,16,22,26,24,30]
for i,v in enumerate(vals):
    x=80+i*90; d.rounded_rectangle((x,640-v*13,x+50,640),6,fill=(102,187,106))
d.rounded_rectangle((760,230,1170,670),14,fill="white"); d.text((780,248),"Crop suitability",fill=(60,60,60))
for i,(n,p) in enumerate([("Cotton",92),("Soybean",85),("Maize",71),("Wheat",48)]):
    y=300+i*80; d.text((780,y),n,fill=(80,80,80)); d.rounded_rectangle((780,y+26,1140,y+44),8,fill=(225,238,226)); d.rounded_rectangle((780,y+26,780+3.6*p,y+44),8,fill=(46,125,50))
im.save(O+"dashboard.png")

# ---------- feature icons (svg) ----------
ic={"disease":("#c62828","M32 14c-9 0-14 6-14 14 0 9 6 16 14 22 8-6 14-13 14-22 0-8-5-14-14-14z M26 26h12M32 20v12"),
"weather":("#1e88e5","M20 40a9 9 0 0 1 2-17 12 12 0 0 1 23 4 7 7 0 0 1-2 13z"),
"crop":("#2e7d32","M32 52V24M32 34c-10 0-14-8-14-14 10 0 14 6 14 14zM32 28c0-8 5-13 14-13 0 8-5 13-14 13z"),
"health":("#ef6c00","M32 50C10 36 14 16 26 18c4 1 6 4 6 6 0-2 2-5 6-6 12-2 16 18-6 32z"),
"community":("#6a1b9a","M32 12l22 38H10z M32 26v12 M32 43v2"),
"analytics":("#00838f","M14 50V30M26 50V18M38 50V34M50 50V12")}
for k,(c,p) in ic.items():
    open(O+"icons/"+k+".svg","w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="31" fill="{c}22"/><path d="{p}" fill="{c}" fill-opacity=".25" stroke="{c}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>')
print("done")
