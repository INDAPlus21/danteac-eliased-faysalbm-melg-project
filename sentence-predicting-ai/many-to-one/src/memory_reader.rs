// read a number starting from a speciefied index from a larger string
// the number must end with a white space " "
pub fn read_number(string: &str, start_index: &usize) -> (f32, usize) {
    let mut number: String = "".to_string();
    let mut index_counter: usize = 0;

    for (i, c) in string.chars().enumerate() {
        index_counter = i;

        if i >= *start_index {
            if c == ' ' {
                break;
            }

            number.push(c);
        }
    }

    number.retain(|c| !c.is_whitespace()); // unsure if this line realy is necceccary
    let num = number.parse::<f32>().unwrap();
    (num, (index_counter + 1))
}
