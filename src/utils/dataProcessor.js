// utils/dataProcessor.js

export const dataProcessor = {
    // Process the raw PDF data into a structured format
    processFaqData(rawData) {
        const faqItems = [];
        
        if (!rawData || typeof rawData !== 'string') {
            return faqItems;
        }
    
        // Simple regex-based extraction
        // This is a basic implementation - you might need to adjust based on your actual PDF structure
        const faqRegex = /(\d+)\s+(.+?)\s+(.+?)\s+(.+?)(?=\d+\s+|$)/gs;
        let match;
        
        while ((match = faqRegex.exec(rawData)) !== null) {
            if (match.length >= 4) {
            faqItems.push({
                id: parseInt(match[1], 10),
                topic: match[2].trim(),
                question: match[3].trim(),
                answer: match[4].trim()
            });
            }
        }
        
        return faqItems;
        },
        
        // Create document chunks for better RAG retrieval
        createDocumentChunks(faqItems, chunkSize = 1000, overlapSize = 200) {
        const documents = [];
        
        faqItems.forEach(faq => {
            const content = `ประเด็น: ${faq.topic}\nคำถาม: ${faq.question}\nคำตอบ: ${faq.answer}`;
            
            // If content is smaller than chunk size, keep it as one document
            if (content.length <= chunkSize) {
            documents.push({
                pageContent: content,
                metadata: {
                source: 'KKU Engineering FAQ',
                id: faq.id.toString(),
                topic: faq.topic
                }
            });
            return;
            }
            
            // For larger content, split into overlapping chunks
            let startIdx = 0;
            while (startIdx < content.length) {
            const endIdx = Math.min(startIdx + chunkSize, content.length);
            documents.push({
                pageContent: content.slice(startIdx, endIdx),
                metadata: {
                source: 'KKU Engineering FAQ',
                id: `${faq.id}-${startIdx}`,
                topic: faq.topic
                }
            });
            
            startIdx += (chunkSize - overlapSize);
            if (startIdx >= content.length) break;
            }
        });
        
        return documents;
        },
        
        // For debugging - print document stats
        getDocumentStats(documents) {
        const stats = {
            totalDocuments: documents.length,
            averageLength: 0,
            minLength: Infinity,
            maxLength: 0,
            topicDistribution: {}
        };
        
        let totalLength = 0;
        
        documents.forEach(doc => {
            const length = doc.pageContent.length;
            totalLength += length;
            
            if (length < stats.minLength) stats.minLength = length;
            if (length > stats.maxLength) stats.maxLength = length;
            
            const topic = doc.metadata.topic;
            if (topic) {
            stats.topicDistribution[topic] = (stats.topicDistribution[topic] || 0) + 1;
            }
        });
        
        stats.averageLength = totalLength / documents.length;
        
        return stats;
    }
};