import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 32 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
    chapterTitle: {
        fontSize: 14,
        fontWeight: "semi-bold",
        marginBottom: 8,
        marginTop: 16,
    },
    paragraph: { fontSize: 12, marginBottom: 8 },
});

export default function BookPdf({ book }) {
    //Generates a pdf file with the book's content
    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.title}>{book.title}</Text>
                {book.chapters?.map((chapter, idx) => (
                    <View key={chapter.id || idx}>
                        <Text style={styles.chapterTitle}>
                            {chapter.title || `Chapter ${idx + 1}`}
                        </Text>
                        {chapter.pages?.map((page, pIdx) => (
                            <View key={page.id || pIdx}>
                                <Text style={styles.paragraph}>
                                    {page.content}
                                </Text>
                            </View>
                        ))}
                        {/* Add more fields as needed, e.g. summary, notes, etc. */}
                    </View>
                ))}
            </Page>
        </Document>
    );
}
