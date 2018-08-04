


function mc_mtimes_MM(m1, m2) {
	if(typeof m1 === 'undefined'||typeof m2 === 'undefined') throw new Error("Not enough input arguments.");
	if(arguments.length > 3) throw new Error("Too many input arguments.");
	if(m1._shape.length > 2 || m2._shape.length > 2) throw Error ("Arguments must be 2-D, or at least one argument must be scalar.");
	var m1_rows = m1._shape[0];
	var m1_cols = m1._shape[1];
	var m2_rows = m2._shape[0];
	var m2_cols = m2._shape[1];
	if (m1_cols !== m2_rows) {
		throw new Error('Inner matrix dimensions must agree.');
	}
	var out = mc_zeros(m1_rows, m2_cols);
	for (var row = 1; row <= m1_rows; ++row) {
		for (var col = 1; col <= m2_cols; ++col) {
			var acc = 0;
			for (var k = 1; k <= m2_rows; ++k) {
				acc += m1.mj_get([row, k]) * m2.mj_get([k, col]);
			}
			out = out.mj_set(acc, [row, col]);
		}
	}
	return out;
}


