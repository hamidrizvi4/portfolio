# Photos folder

Drop your photo files in this directory.

## Naming convention
Use simple sequential names: `01.jpg`, `02.jpg`, `03.jpg`, etc.

## Format & size
- **Format:** JPEG or WebP (smaller file size)
- **Aspect ratio:** 4:5 portrait recommended (e.g. 1200x1500px)
- **Quality:** 80-85 for JPEG keeps files under 300KB
- **Total photos:** 6-8 recommended

## After dropping files here
1. Open `components/OffDutySection.tsx`
2. Find the `PHOTOS` array near the top
3. Replace `src: null` with `src: '/photos/01.jpg'` for each photo
4. Update the `caption` and `location` fields to match
5. Save and the carousel will render your real photos

## Optimization tip
For better web performance, run images through https://squoosh.app before uploading.
