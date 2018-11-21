# Memory management

## Doug Lea

- Boundary tags to free and carry size. Can go either forwards or backwards.
- Best fit approach is normally used, if a tie is present, oldest-first is taken.
- Smallest chunk is 16bytes, i.e. 8 header/footer, 8 pointers to prev/next.
- We require a 16 byte, minimum chunk. Every allocation must be modulo 16 then. e.g. if 17 bytes are required. 32 bytes are given.
Locality preservation: Chunks that  are allocated around the same time in the program tend to have similar patterns and coexisting lifetimes.
**Rule**: If there is not a chunk with the exact size requested, the most recently split-off chunk is used if large enough, if not best-fit strategy is used.
- Keep track of the largest allocated memory chunk in the free-list. Via largest pointer, treat this one as the largest possible chunk since it can be arbitrarily grown.
- Coalescing happens with "freeing"

If a small request (< 256 bytes minus per-chunk overhead)
1. If one exists, use a remainderless chunk in associated smallbin.
  (Remainderless means that there are too few excess bytes to
  represent as a chunk.)
2. If it is big enough, use the dv chunk, which is normally the
  chunk adjacent to the one used for the most recent small request.
3. If one exists, split the smallest available chunk in a bin,
  saving remainder in dv.
4. If it is big enough, use the top chunk.
5. If available, get memory from system and use it
Otherwise, for a large request:
1. Find the smallest available binned chunk that fits, and use it
  if it is better fitting than dv chunk, splitting if necessary.
2. If better fitting than any binned chunk, use the dv chunk.
3. If it is big enough, use the top chunk.
4. If request size >= mmap threshold, try to directly mmap this chunk.
5. If available, get memory from system and use it

## Chunk Representations

- Chunks are maintained using a boundary tag.
- The size of each chunk is store both at the end of each chunk and at the beginning
- This makes consolidating fragmented chunks into bigger chunks faster.
- The head fields also hold bits representing whether chunks are free or in use
- Since we always merge adjacent free chunks, the chunks adjacent to the free chunk are in use.

