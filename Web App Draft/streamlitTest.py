import streamlit as st
from streamlit_option_menu import option_menu

        # Sidebar Navigation Menu
with st.sidebar:
    selected = option_menu("Menu", ["Home","Ambition 1", "Ambition 2","Ambition 3", 'Settings'], icons=['house', '', '', '', 'gear'], menu_icon="cast", default_index=1)
    selected


def main():
    st.title("Lambeth Data Packs 2024")

    # Create columns to display buttons horizontally
col1, col2, col3 = st.columns(3)

# Button to go to Page 1
with col1:
    st.write("Ambition 1")
    st.write("Description of Ambition 1")
    st.button("Go to Page 1")

# Button to go to Page 2
with col2:
    st.write("Ambition 2")
    st.write("Description of Ambition 2")
    st.button("Go to Page 2")

# Button to go to Page 3
with col3:
    st.write("Ambition 3")
    st.write("Description of Ambition 3")
    st.button("Go to Page 3")
if __name__ == "__main__":
    main()

